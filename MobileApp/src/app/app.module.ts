import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { ListController } from "../pages/ListView/list";
import { MapController } from "../pages/MapView/map";
import { AddRatingPage } from "../pages/AddRating/rating";
import { RestaurantPage } from "../pages/Restaurant/RestaurantPage";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Services
import { DataStore } from "../shared/services/global.datastore.service";
import { ApiService } from '../shared/services/api-service';
import { PageDataHub } from "../shared/services/page-data-hub.service";
import { AutocompleteApiService } from "../shared/services/autocomplete-api-service";
import { TypeaheadComponent } from "../components/typeahead/typeahead";
import { LocationModal } from "../components/set-location-modal/LocationModal";

import {GoogleMap} from "@ionic-native/google-maps";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    RestaurantPage,
    ListController, MapController, AddRatingPage, TypeaheadComponent, LocationModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    RestaurantPage,
    ListController, MapController, AddRatingPage, LocationModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataStore,
    ApiService,
    PageDataHub,
    AutocompleteApiService
  ]
})
export class AppModule {}
