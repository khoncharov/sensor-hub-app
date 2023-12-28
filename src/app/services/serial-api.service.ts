import { Injectable } from '@angular/core';
import FrameBuffer from '../utils/frame-buffer';

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

const frameBuffer = new FrameBuffer(controller);

const usbVendorId = 0x1a86;
// const usbProductId = 0x7523;

@Injectable({
  providedIn: 'root',
})
export class SerialAPIService {
  private serial = navigator.serial;

  constructor() {
    this.serial.addEventListener('connect', this.connectHandler);

    this.serial.addEventListener('disconnect', this.disconnectHandler);
  }

  requestPort(): void {
    // TODO: readable stream isLocked check
    this.serial
      .requestPort({ filters: [{ usbVendorId }] })
      .then(async (port) => {
        await port.open({ baudRate: 115200 });
        console.log('port >', port);
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
                frameBuffer.push(byte);
              });
            }
          } catch (error) {
            console.log(error);
          } finally {
            reader.releaseLock();
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async getPorts(): Promise<Array<SerialPort>> {
    const ports = await this.serial.getPorts();
    return ports;
  }

  connectHandler(e: Event): void {
    // Connect to `e.target` or add it to a list of available ports.
    console.log('Event: connect');
    console.log(e);
    // document.querySelector('.connection-state').classList.add('connected');
  }

  disconnectHandler(e: Event): void {
    // Remove `e.target` from the list of available ports.

    console.log('Event: disconnect');
    console.log(e);
    // document.querySelector('.connection-state').classList.remove('connected');
  }
}
