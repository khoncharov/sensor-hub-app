import { createSelector } from '@ngrx/store';

import { AppState } from './app-state.types';
import { SerialPortState } from '../reducers/serial-port.reducers';

export const selectSerialPort = (state: AppState) => state.serialPort;

export const selectPort = createSelector(
  selectSerialPort,
  (state: SerialPortState) => state.port
);

export const selectPortState = createSelector(
  selectSerialPort,
  (state: SerialPortState) => state.isConnected
);
