import { createAction, props } from '@ngrx/store';
import { FrameJSONObject } from '../../utils/frame-converter';

export const startRecording = createAction('[Sensors data] Start recording');

export const stopRecording = createAction('[Sensors data] Stop recording');

export const update = createAction(
  '[Sensors data] Update',
  props<{ latestFrame: FrameJSONObject }>()
);
