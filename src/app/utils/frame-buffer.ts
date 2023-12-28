const FRAME_SIZE = 13;

const SERVICE_BYTES_MAP = {
  byte0: { index: 0, expectedValue: 0 },
  byte1: { index: 1, expectedValue: 0 },
  byte2: { index: 2, expectedValue: 0 },
  byte4: { index: 4, expectedValue: 1 },
  byte7: { index: 7, expectedValue: 2 },
  byte10: { index: 10, expectedValue: 3 },
  byte13: { index: 13, expectedValue: 4 },
  byte16: { index: 16, expectedValue: 5 },
  byte19: { index: 19, expectedValue: 6 },
} as const;

interface Controller {
  enqueue: (data: Uint8Array) => void;
}

export default class FrameBuffer {
  private frame = new Uint8Array(FRAME_SIZE);

  private emptyPosition = 0;

  private receivedByteIndex = 0;

  private controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  compareBytes(actualValue: number, expectedValue: number): void {
    if (actualValue === expectedValue) {
      this.receivedByteIndex += 1;
    } else {
      this.receivedByteIndex = 0;
    }
  }

  push(value: number): void {
    switch (this.receivedByteIndex) {
      case SERVICE_BYTES_MAP.byte0.index:
      case SERVICE_BYTES_MAP.byte1.index:
      case SERVICE_BYTES_MAP.byte2.index:
        this.compareBytes(value, SERVICE_BYTES_MAP.byte2.expectedValue);
        break;
      case SERVICE_BYTES_MAP.byte4.index:
        this.compareBytes(value, SERVICE_BYTES_MAP.byte4.expectedValue);
        break;
      case SERVICE_BYTES_MAP.byte7.index:
        this.compareBytes(value, SERVICE_BYTES_MAP.byte7.expectedValue);
        break;
      case SERVICE_BYTES_MAP.byte10.index:
        this.compareBytes(value, SERVICE_BYTES_MAP.byte10.expectedValue);
        break;
      case SERVICE_BYTES_MAP.byte13.index:
        this.compareBytes(value, SERVICE_BYTES_MAP.byte13.expectedValue);
        break;
      case SERVICE_BYTES_MAP.byte16.index:
        this.compareBytes(value, SERVICE_BYTES_MAP.byte16.expectedValue);
        break;
      case SERVICE_BYTES_MAP.byte19.index:
        this.compareBytes(value, SERVICE_BYTES_MAP.byte19.expectedValue);
        break;

      default:
        this.addToFrame(value);
        break;
    }
  }

  addToFrame(value: number): void {
    const offset = this.emptyPosition;
    this.frame.set([value], offset);
    this.emptyPosition += 1;
    this.receivedByteIndex += 1;

    const isCompleteFrame = this.emptyPosition === this.frame.length;
    if (isCompleteFrame) {
      this.controller.enqueue(this.frame);
      this.emptyPosition = 0;
      this.receivedByteIndex = 0;
    }
  }
}
