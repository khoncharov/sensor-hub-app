import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { frameToJSON } from '../utils/frame-converter';
import { FrameJSONSimplifiedObject } from '../models/frame.model';
import * as sensorDataActions from '../store/actions/sensors-data.actions';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService {
  private readonly store = inject(Store);

  private data!: FrameJSONSimplifiedObject[];

  // private isRecording$: Observable<boolean>;

  enqueue(frame: Uint8Array) {
    const latestFrame = frameToJSON(frame);

    this.store.dispatch(sensorDataActions.update({ latestFrame }));
  }
}
