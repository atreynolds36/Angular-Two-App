/**
 * Created by areynolds2 on 10/27/2017.
 */

import {Component , OnInit } from '@angular/core';

import { Restaurant , Rating } from '../../../../types/API_Consumption_Types';
import { Api } from '../../../../services/api.service';

import { DisplayListType } from '../../enums/index';

import { LandingPageApiService } from '../../services/landing-page.api.service';
import { LandingPageDataHub } from '../../services/landing-page-data-hub.service';
import {AbstractListPageClass} from "../page-component-abstract-class";
import {DataStore} from "../../../../services/global.datastore.service";

import { ActivePanel , ActiveComponentEnum } from "../../enums";


@Component({
  templateUrl: './template.html'
})
export class MainComponent extends AbstractListPageClass {
  types : string[];

  pane : string = 'LIST';

  constructor( private api : Api , private newApi : LandingPageApiService , private datahub : LandingPageDataHub , datastore : DataStore ){
    super( datastore );
    this.datahub.dataListEmitter.subscribe( (list) => {} );
  }

  ngOnInit() : void {
    super.ngOnInit();

    console.log( this.lat + "///" + this.lng );

    this.datahub.getRestaurantList(this.lat,this.lng)
      .subscribe( (list) => {
        console.log('returned here');
        this.restaurantList = list;
      } );


    this.api.getFoodTypes()
      .then( types => this.types = types );
  }

  searchByCuisine( type ) : void {
    console.log('search by ttpe');


    this.newApi.getRestautantsByCusine(type, this.lat, this.lng )
      .subscribe( (list) => {
        this.activeList = DisplayListType.RESTAURANT;
        this.restaurantList = list
      });
  }

  sendFoodQuery( food : string ) : void {
    this.newApi.getRatingsByFoodType(food , this.lat , this.lng)
      .subscribe( (resList) => {
        this.ratingsList = resList;
        this.activeList = DisplayListType.RATINGS;
      })
  }
}
