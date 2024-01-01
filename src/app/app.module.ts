import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { serialPortReducer } from './store/reducers/serial-port.reducers';

const reducers = { serialPort: serialPortReducer };

const devtoolsOptions = {
  maxAge: 25,
  logOnly: !isDevMode(),
  autoPause: true,
  trace: false,
  traceLimit: 75,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument(devtoolsOptions),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
