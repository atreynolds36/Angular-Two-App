import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MapController } from "../MapView/map";
import { ListController } from "../ListView/list";
import { AddRatingPage } from "../AddRating/rating";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  listView : any = ListController;
  mapView : any = MapController;
  addRatingPage : any = AddRatingPage;

  constructor(public navCtrl: NavController) {

  }

  showAddRatingPage(){
    this.navCtrl.push( this.addRatingPage );
  }

}
