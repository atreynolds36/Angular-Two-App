import {OnInit} from "@angular/core";
import {DataStore} from "../../../services/global.datastore.service";
import {Rating, Restaurant} from "../../../types/API_Consumption_Types";
import {DisplayListType} from "../enums";

import { ActivePanel , ActiveComponentEnum } from "../enums";

export abstract class AbstractListPageClass implements OnInit {
  lat : number;
  lng : number;

  ActivePanel : typeof ActivePanel = ActivePanel;
  ActiveComponentEnum : typeof ActiveComponentEnum = ActiveComponentEnum;
  activeComponent : ActiveComponentEnum;

  activeList : DisplayListType;
  ActiveList : typeof DisplayListType = DisplayListType;

  panel : ActivePanel;
  ratingsList : Rating[];
  restaurantList : Restaurant[] ;

  constructor( datastore : DataStore ){
    this.lat = datastore.lat;
    this.lng = datastore.lng;
  }

  ngOnInit(){
    console.log('super init');
    this.panel = ActivePanel.FOOD;
    this.activeComponent = ActiveComponentEnum.LIST;
    this.activeList = DisplayListType.RESTAURANT;
  }

}

