import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { frameToJSON } from '../utils/frame-converter';
import * as sensorDataActions from '../store/actions/sensors-data.actions';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService {
  private readonly store = inject(Store);

  // protected data!: Uint8Array[];

  enqueue(frame: Uint8Array) {
    const latestFrame = frameToJSON(frame);

    this.store.dispatch(sensorDataActions.update({ latestFrame }));
  }
}
