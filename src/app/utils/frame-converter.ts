export interface FrameJSONObject {
  source: number;
  timeStamp: number;
  sensor1: number;
  sensor2: number;
  sensor3: number;
  sensor4: number;
}

export const frameToJSON = (frame: Uint8Array): FrameJSONObject => {
  const dv = new DataView(frame.buffer);
  const source = dv.getInt8(0);
  const timeStamp = dv.getInt32(1);
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
