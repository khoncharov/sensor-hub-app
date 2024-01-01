import { createAction, props } from '@ngrx/store';

export const add = createAction(
  '[Serial port] Add',
  props<{ port: SerialPort | null }>()
);

export const remove = createAction('[Serial port] Remove');

export const connect = createAction('[Serial port] Connect');
