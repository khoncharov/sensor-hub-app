export interface FrameJSONObject {
  source: number;
  timeStamp: number;
  sensor1: number;
  sensor2: number;
  sensor3: number;
  sensor4: number;
}

export interface FrameJSONSimplifiedObject {
  s: number;
  t: number;
  a: number;
  b: number;
  c: number;
  d: number;
}
