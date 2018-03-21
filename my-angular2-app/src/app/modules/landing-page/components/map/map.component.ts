import {Component, OnInit , Input } from '@angular/core';

import { Api } from '../../../../services/api.service';
import { Restaurant , Rating } from '../../../../types/API_Consumption_Types';
import { DisplayListType} from '../../enums/index';

@Component({
  selector : 'map-component',
  templateUrl: './map.template.html',
  styleUrls: ['../../../../app.component.css']
})
export class MapComponent implements OnInit{
  results : Restaurant[];
  markers : Restaurant[] = [];

  markerList : Array<any>;

  // google maps zoom level
  zoom: number = 14;

  @Input() restaurantList : Restaurant[];
  @Input() ratingsList : Rating[];
  MarkerType : typeof DisplayListType = DisplayListType;
  @Input() listType : DisplayListType;

  // initial center position for the map
  lat: number = 40.743991;
  lng: number = -74.032363;

  constructor( private api : Api ){}

  ngOnInit() : void {
    console.log( this.listType );

    this.transformInputList();
  }

  transformInputList(){
    console.log('HIT' + this.listType);
    if( this.listType == DisplayListType.RATINGS ){
      //won't be
    }else{
      console.log( 'else');
      this.markers = this.restaurantList.map( (res) => {
        res.lat = Number(res.lat);
        res.lng = Number(res.lng);
        return res;
      });
      console.log(this.markers.length);
    }
  }

  performSearch() : void {
    this.api
      .getAllRestaurants()
      .then(restaurants => this.markers = restaurants.map( (r) => {
        r.lat = Number(r.lat);
        r.lng = Number(r.lng);
        return r;
      }));
  }

  loadRestaurantRatings(id){
    console.log(id);
  }
}
