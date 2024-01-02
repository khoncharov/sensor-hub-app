import { createReducer, on } from '@ngrx/store';

import { FrameJSONObject } from '../../models/frame.model';
import * as sensorsDataActions from '../actions/sensors-data.actions';

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

  on(sensorsDataActions.update, (state, { latestFrame }) => ({
    ...state,
    latestFrame,
  })),

  on(sensorsDataActions.startRecording, (state) => ({
    ...state,
    isRecording: true,
  })),

  on(sensorsDataActions.stopRecording, (state) => ({
    ...state,
    isRecording: false,
  }))
);
