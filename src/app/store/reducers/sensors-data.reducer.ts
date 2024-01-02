import { createReducer, on } from '@ngrx/store';

import * as sensorsDataActions from '../actions/sensors-data.actions';
import { FrameJSONObject, frameToJSON } from '../../utils/frame-converter';

export interface SensorsDataState {
  latestFrame: FrameJSONObject | null;
  isRecording: boolean;
}

export const initialState: SensorsDataState = {
  latestFrame: null,
  isRecording: false,
};

export const sensorsDataReducer = createReducer(
  initialState,

  on(sensorsDataActions.update, (state, { frame }) => {
    const latestFrame = frameToJSON(frame);
    return {
      ...state,
      latestFrame,
    };
  }),

  on(sensorsDataActions.startRecording, (state) => ({
    ...state,
    isRecording: true,
  })),

  on(sensorsDataActions.stopRecording, (state) => ({
    ...state,
    isRecording: false,
  }))
);
