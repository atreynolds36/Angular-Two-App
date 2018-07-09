import { Component, ViewChild } from '@angular/core';
import {ModalController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DataStore } from "../shared/services/global.datastore.service";

import { LocationModal } from "../components/set-location-modal/LocationModal";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  lat: number = 40.743991;
  lng: number = -74.032363;
  name : string = 'Hoboken, NJ';

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public datastore : DataStore ,
              public modalCtrl : ModalController ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

    //Get gps coordinates
    this.datastore.setLocation(this.name , this.lat , this.lng );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  showSetLocationModal(){
    let profileModal = this.modalCtrl.create(LocationModal);
    profileModal.present();
  }
}
