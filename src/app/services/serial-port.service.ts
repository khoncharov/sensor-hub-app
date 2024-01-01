import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import FrameBuffer from '../utils/frame-buffer';
import * as serialPortActions from '../store/actions/serial-port.actions';

const controller = {
  enqueue: (data: Uint8Array) => {
    console.log(data);
    const dv = new DataView(data.buffer);

    const addr = dv.getInt8(0);
    const time = dv.getInt32(1);
    const sensor1 = dv.getInt16(5);
    const sensor2 = dv.getInt16(7);
    const sensor3 = dv.getInt16(9);
    const sensor4 = dv.getInt16(11);
    console.log(
      addr,
      (time / 1000).toFixed(2),
      sensor1,
      sensor2,
      sensor3,
      sensor4
    );
  },
};

const baudRate = 115200;
const usbVendorId = 0x1a86;
const usbProductId = 0x7523;

@Injectable({
  providedIn: 'root',
})
export class SerialPortService {
  private readonly store = inject(Store);

  private serial = navigator.serial;

  private frameBuffer = new FrameBuffer(controller);

  constructor() {
    this.serial.addEventListener('connect', (e: Event) => {
      const port = e.target as SerialPort;
      this.store.dispatch(serialPortActions.add({ port }));
    });

    this.serial.addEventListener('disconnect', () => {
      this.store.dispatch(serialPortActions.remove());
    });

    document.addEventListener('DOMContentLoaded', async () => {
      const port = await this.getPort();
      this.store.dispatch(serialPortActions.add({ port }));
    });
  }

  requestPort(): void {
    this.serial
      .requestPort({ filters: [{ usbVendorId, usbProductId }] })
      .then((port) => {
        this.store.dispatch(serialPortActions.add({ port }));
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async getPort(): Promise<SerialPort | null> {
    const ports = await this.serial.getPorts();
    if (ports.length) {
      return ports[0];
    }
    return null;
  }

  async openPort(port: SerialPort): Promise<void> {
    try {
      await port.open({ baudRate });
      this.store.dispatch(serialPortActions.connect());
    } catch (error) {
      console.error(error);
    }

    while (port.readable) {
      const reader = port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log('The stream is done.');
            break;
          }
          value.forEach((byte: number) => {
            this.frameBuffer.push(byte);
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        reader.releaseLock();
      }
    }
  }
}
