import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LinearModelComponent} from './linear-model/linear-model.component';
import {TimeSeriesComponent} from './time-series/time-series.component';

const routes: Routes = [
  { path: 'linearmodel', component: LinearModelComponent },
  { path: 'timeseries', component: TimeSeriesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
