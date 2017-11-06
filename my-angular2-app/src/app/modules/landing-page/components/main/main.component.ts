/**
 * Created by areynolds2 on 10/27/2017.
 */

import {Component , OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { Restaurant , Rating } from '../../../../types/db_objects';
import { Api } from '../../../../services/api.service';

import { DisplayListType } from '../../enums/index';
enum ActivePanel {
  FOOD,
  CUISINE
}


import { LandingPageApiService } from '../../services/landing-page.api.service';
import { LandingPageDataHub } from '../../services/landing-page-data-hub.service';

enum ActiveComponentEnum{
  MAP,
  LIST
}


@Component({
  templateUrl: './template.html'
})
export class MainComponent implements OnInit {
  ActivePanel : typeof ActivePanel = ActivePanel;

  ActiveComponentEnum : typeof ActiveComponentEnum = ActiveComponentEnum;
  activeComponent : ActiveComponentEnum;

  ActiveList : typeof DisplayListType = DisplayListType;
  activeList : DisplayListType;

  panel : ActivePanel;
  types : string[];
  restaurantList : Restaurant[] ;
  ratingsList : Rating[];

  // initial center position for the map
  lat: number = 40.743991;
  lng: number = -74.032363;

  pane : string = 'LIST';

  constructor( private api : Api , private newApi : LandingPageApiService , private datahub : LandingPageDataHub ){
    this.datahub.dataListEmitter.subscribe( (list) => {} );
  }

  ngOnInit() : void {
    this.panel = ActivePanel.FOOD;
    this.activeComponent = ActiveComponentEnum.LIST;
    this.activeList = DisplayListType.RESTAURANT;
    //this.newApi.getTopRatedRestaurantsInArea(this.lat , this.lng )
      //.subscribe();
    this.datahub.getRestaurantList(this.lat,this.lng)
      .subscribe( (list) => { console.log('returned here'); this.restaurantList = list; } );


    this.api.getFoodTypes()
      .then( types => this.types = types );
  }

  searchByCuisine( type ) : void {
    console.log('search by ttpe');
    this.datahub.getRestautantsByCusine(type, this.lat, this.lng )
      .subscribe( (list) => {
        this.activeList = DisplayListType.RESTAURANT;
        this.restaurantList = list
      });

    /*
    this.newApi
      .getRatingsByFoodType( type, this.lat , this.lng )
      .subscribe();
    */
  }
  sendFoodQuery( food : string ) : void {
    this.newApi.getRatingsByFoodType(food , this.lat , this.lng)
      .subscribe( (resList) => {
        this.ratingsList = resList;
        this.activeList = DisplayListType.RATINGS;
      })
  }
}
