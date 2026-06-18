import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, bufferCount } from 'rxjs';

import { FileSystemAccessApiService } from './services/file-system-access-api.service';
import { SerialPortService } from './services/serial-port.service';
import { SensorDataService } from './services/sensors-data.service';
import { FrameTuple } from './models/frame.model';
import * as sensorDataActions from './store/actions/sensors-data.actions';
import * as fromSerialPort from './store/selectors/serial-port.selectors';
import * as fromSensors from './store/selectors/sensors-data.selectors';

type ConversionFuncParams = {
  value: number;
  k: number;
  b: number;
  units: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private fs = inject(FileSystemAccessApiService);

  private sp = inject(SerialPortService);

  private readonly store = inject(Store);

  private readonly sensorsData = inject(SensorDataService);

  protected port$!: Observable<SerialPort | null>;

  protected portIsConnected$!: Observable<boolean>;

  protected lastFrame$!: Observable<FrameTuple | null>;

  protected isRecording$!: Observable<boolean>;

  protected refPressureStr = '';

  public sens1Avg$!: Observable<string | null>;

  public sens2Avg$!: Observable<string | null>;

  ngOnInit() {
    this.port$ = this.store.select(fromSerialPort.selectPort);
    this.portIsConnected$ = this.store.select(fromSerialPort.selectPortState);

    this.lastFrame$ = this.store.select(fromSensors.selectLatestFrame);
    this.isRecording$ = this.store.select(fromSensors.selectRecordingState);

    this.sens1Avg$ = this.lastFrame$?.pipe(
      map((f) => {
        if (!f) return 0;
        return f[2];
      }),
      bufferCount(8, 1),
      map((buffer) => {
        const sum = buffer.reduce((acc, val) => acc + val, 0);
        return sum / buffer.length;
      }),
      map((value) => {
        return this.converterFunc({
          value,
          k: 0.075,
          b: -199,
          units: "kPa",
        })
      })
    );

    this.sens2Avg$ = this.lastFrame$?.pipe(
      map((f) => {
        if (!f) return 0;
        return f[3];
      }),
      bufferCount(8, 1),
      map((buffer) => {
        const sum = buffer.reduce((acc, val) => acc + val, 0);
        return sum / buffer.length;
      }),
      map((value) => {
        return this.converterFunc({
          value,
          k: 0.075,
          b: -199,
          units: "kPa",
        })
      })
    );
  }

  getOpenedFile(): void {
    this.fs.getOpenedFile();
  }

  saveDataToFile(): void {
    this.fs.saveDataToFile(this.refPressureStr);
    this.refPressureStr = '';
  }

  addDevice(): void {
    this.sp.requestPort();
  }

  connectPort(port: SerialPort): void {
    this.sp.openPort(port);
  }

  startRecording(): void {
    this.sensorsData.clearData();
    this.store.dispatch(sensorDataActions.startRecording());
    this.refPressureStr = '';
  }

  stopRecording(): void {
    this.store.dispatch(sensorDataActions.stopRecording());
  }

  converterFunc(funcParams: ConversionFuncParams): string {
    const { value, k, b, units } = funcParams;
    return `${(k * value + b).toFixed(1)} ${units}`;
  }
}
