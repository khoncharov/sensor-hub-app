import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as sensorDataActions from '../store/actions/sensors-data.actions';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService {
  private readonly store = inject(Store);

  // protected data!: Uint8Array[];

  enqueue(frame: Uint8Array) {
    console.log(frame);

    // this.store.dispatch(sensorDataActions.update({ frame }));
  }
}
