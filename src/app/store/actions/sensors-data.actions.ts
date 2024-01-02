import { createAction, props } from '@ngrx/store';

export const startRecording = createAction('[Sensors data] Start recording');

export const stopRecording = createAction('[Sensors data] Stop recording');

export const update = createAction(
  '[Sensors data] Update',
  props<{ frame: Uint8Array }>()
);
