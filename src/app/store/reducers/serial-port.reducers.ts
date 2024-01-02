import { createReducer, on } from '@ngrx/store';

import * as serialPortActions from '../actions/serial-port.actions';

export interface SerialPortState {
  port: SerialPort | null;
  isConnected: boolean;
}

export const initialState: SerialPortState = {
  port: null,
  isConnected: false,
};

export const serialPortReducer = createReducer(
  initialState,

  on(serialPortActions.add, (state, { port }) => {
    if (state.port === null) {
      return { port, isConnected: false };
    }
    return state;
  }),

  on(serialPortActions.remove, (state) => {
    if (state.port) {
      return { port: null, isConnected: false };
    }
    return state;
  }),

  on(serialPortActions.connect, (state) => ({
    ...state,
    isConnected: true,
  }))
);
