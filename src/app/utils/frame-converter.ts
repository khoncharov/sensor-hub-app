import { FrameJSONObject } from '../models/frame.model';

export const frameToJSON = (frame: Uint8Array): FrameJSONObject => {
  const dv = new DataView(frame.buffer);

  const source = dv.getInt8(0);
  const timeStamp = Number((dv.getInt32(1) / 1000).toFixed(2));
  const sensor1 = dv.getInt16(5);
  const sensor2 = dv.getInt16(7);
  const sensor3 = dv.getInt16(9);
  const sensor4 = dv.getInt16(11);

  return {
    source,
    timeStamp,
    sensor1,
    sensor2,
    sensor3,
    sensor4,
  };
};
