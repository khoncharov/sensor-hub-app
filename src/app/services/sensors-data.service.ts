import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { frameToJSON } from '../utils/frame-converter';
import { FrameJSONSimplifiedObject } from '../models/frame.model';
import * as sensorDataActions from '../store/actions/sensors-data.actions';
import * as fromSensors from '../store/selectors/sensors-data.selectors';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService implements OnDestroy {
  private readonly store = inject(Store);

  private data: FrameJSONSimplifiedObject[] = [];

  private isRecording$!: Observable<boolean>;

  private isRec: boolean = false;

  private sub!: Subscription;

  constructor() {
    this.isRecording$ = this.store.select(fromSensors.selectRecordingState);
    this.sub = this.isRecording$.subscribe((state) => {
      this.isRec = state;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  enqueue(frame: Uint8Array): void {
    const latestFrame = frameToJSON(frame);

    if (this.isRec) {
      this.data.push({
        s: latestFrame.source,
        t: latestFrame.timeStamp,
        a: latestFrame.sensor1,
        b: latestFrame.sensor2,
        c: latestFrame.sensor3,
        d: latestFrame.sensor4,
      });
    }

    this.store.dispatch(sensorDataActions.update({ latestFrame }));
  }

  clearData(): void {
    this.data.length = 0;
  }

  getData(): FrameJSONSimplifiedObject[] {
    return this.data;
  }
}
