import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule , XHRBackend , RequestOptions , Http , XSRFStrategy , BrowserXhr , ResponseOptions , JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AddRatingView , AddRestaurantView , AddMealView } from './components/add-form-views';
import { MyTypeahead } from './components/typeahead/typeahead';

import { Api } from './services/api.service';
import { GoogleGeoCodeApi } from './services/google.maps.api.service';

import { AppRoutingModule } from './router/app.router.module';
import { AgmCoreModule } from '@agm/core';
import {ExternalApiXsrfStrategy, ExternalHttp, ExternalXHRBackend} from './config/external_http';
import { AlertModule  } from 'ngx-bootstrap';

import { LandingPageModule } from './modules/landing-page/landing-page.module';

import { DataStore } from './services/global.datastore.service';
import {SharedServicesModule} from "./modules/shared-services/shared-services.module";


//Needed for AoT Compiler
/////////////////////////
export const ExternalApiXsrfFactory = function() {
  return new ExternalApiXsrfStrategy();
};

export const ExternalXhrBackendFactory = function(BrowserXhr , responseOptions, ExternalApiXsrfStrategy){
  return new XHRBackend(BrowserXhr , responseOptions , ExternalApiXsrfStrategy)
};

export const ExternalHttpFactory = function(_backend , _requestOptions){
  return new Http(_backend, _requestOptions )
};

@NgModule({
  declarations: [
    AppComponent,
    AddRatingView,AddRestaurantView,AddMealView, MyTypeahead
  ],
  imports: [
    SharedServicesModule,
    BrowserModule, LandingPageModule,
    FormsModule,
    HttpModule, JsonpModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBGl1fMQneNqJqqco8G-Ptluhm7qkd01B8'
    }),
    AlertModule.forRoot()
  ],
  providers: [ Api , GoogleGeoCodeApi , // DataStore,
    {
      provide : ExternalApiXsrfStrategy,
      //useFactory : () => {
      useFactory : ExternalApiXsrfFactory
    },
    {
      provide : 'ExternalXhrBackend',
      //useFactory : (BrowserXhr , responseOptions, ExternalApiXsrfStrategy) => {
      useFactory : ExternalXhrBackendFactory,
      deps : [BrowserXhr , ResponseOptions , ExternalApiXsrfStrategy ]
    },{
      provide : ExternalHttp,
      //useFactory : (_backend , _requestOptions) => {
      useFactory : ExternalHttpFactory,
      deps : ['ExternalXhrBackend' , RequestOptions ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
