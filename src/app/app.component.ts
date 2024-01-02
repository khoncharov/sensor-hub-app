import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FileSystemAccessApiService } from './services/file-system-access-api.service';
import { SerialPortService } from './services/serial-port.service';
import { FrameJSONObject } from './utils/frame-converter';
import * as fromSerialPort from './store/selectors/serial-port.selectors';
import * as fromSensors from './store/selectors/sensors-data.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private fs = inject(FileSystemAccessApiService);

  private sp = inject(SerialPortService);

  private readonly store = inject(Store);

  protected port$!: Observable<SerialPort | null>;

  protected portIsConnected$!: Observable<boolean>;

  protected lastFrame$!: Observable<FrameJSONObject | null>;

  protected isRecording$!: Observable<boolean>;

  ngOnInit() {
    this.port$ = this.store.select(fromSerialPort.selectPort);
    this.portIsConnected$ = this.store.select(fromSerialPort.selectPortState);

    this.lastFrame$ = this.store.select(fromSensors.selectLatestFrame);
    this.isRecording$ = this.store.select(fromSensors.selectRecordingState);
  }

  getOpenedFile(): void {
    this.fs.getOpenedFile();
  }

  saveDataToFile(): void {
    this.fs.saveDataToFile();
  }

  addDevice(): void {
    this.sp.requestPort();
  }

  connectPort(port: SerialPort): void {
    this.sp.openPort(port);
  }
}
