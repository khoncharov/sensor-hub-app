import { SensorsDataState } from '../reducers/sensors-data.reducer';
import { SerialPortState } from '../reducers/serial-port.reducers';

export interface AppState {
  serialPort: SerialPortState;
  sensors: SensorsDataState;
}
