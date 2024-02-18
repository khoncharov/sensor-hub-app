import { Injectable, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { frameToTuple } from '../utils/frame-converter';
import { FrameTuple } from '../models/frame.model';
import * as sensorDataActions from '../store/actions/sensors-data.actions';
import * as fromSensors from '../store/selectors/sensors-data.selectors';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService implements OnDestroy {
  private readonly store = inject(Store);

  private data: FrameTuple[] = [];

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
    const latestFrame = frameToTuple(frame);

    if (this.isRec) {
      this.data.push(latestFrame);
    }

    this.store.dispatch(sensorDataActions.update({ latestFrame }));
  }

  clearData(): void {
    this.data.length = 0;
  }

  getData(): FrameTuple[] {
    return this.data;
  }
}
