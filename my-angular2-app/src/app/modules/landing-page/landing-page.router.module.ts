/**
 * Created by areynolds2 on 10/27/2017.
 */
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ListViewComponent} from './components/list-view/list-view.component';
import { MapComponent } from './components/map/map.component';
import { MainComponent } from './components/main/main.component';



export const routes: Routes = [
  { path: 'search', component: MainComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class LandingPageRouter {}
