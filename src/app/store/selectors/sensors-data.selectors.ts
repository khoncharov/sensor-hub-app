import { createSelector } from '@ngrx/store';

import { AppState } from './app-state.types';
import { SensorsDataState } from '../reducers/sensors-data.reducer';

export const selectSensors = (state: AppState) => state.sensors;

export const selectRecordingState = createSelector(
  selectSensors,
  (state: SensorsDataState) => state.isRecording
);

export const selectLatestFrame = createSelector(
  selectSensors,
  (state: SensorsDataState) => state.latestFrame
);
