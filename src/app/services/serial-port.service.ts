import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import FrameBuffer from '../utils/frame-buffer';
import { SensorDataService } from './sensors-data.service';
import * as serialPortActions from '../store/actions/serial-port.actions';

const baudRate = 115200;
const usbVendorId = 0x1a86;
const usbProductId = 0x7523;

@Injectable({
  providedIn: 'root',
})
export class SerialPortService {
  private readonly store = inject(Store);

  private serial = navigator.serial;

  private frameBuffer!: FrameBuffer;

  constructor() {
    const dataController = inject(SensorDataService);
    this.frameBuffer = new FrameBuffer(dataController);

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
      // .requestPort({ filters: [{ usbVendorId, usbProductId }] })
      .requestPort()
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
            console.info('The stream is done.');
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
