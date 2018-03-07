import {Component, OnInit} from '@angular/core';

import { Api } from '../services/api.service';
import { GoogleGeoCodeApi } from '../services/google.maps.api.service';

import {LatLng , LatLngBounds} from '@agm/core/services/google-maps-types';

import {FormControl } from '@angular/forms';
import { Restaurant } from '../types/API_Consumption_Types';
import {Observable , Subject } from "rxjs";
@Component({
  selector: 'add-rating-view',
  templateUrl: '../views/add-rating-form-view.html',
  styleUrls: ['../app.component.css']
})
export class AddRatingView implements OnInit{
  restaurants : Restaurant[];

  autoCompleteObservable : Observable<any>;
  // initial center position for the map
  lat: number = 40.743991;
  lng: number = -74.032363;

  restaurantSearchTerm$ = new Subject<string>();
  description : string = "description";

  constructor( private api : Api  , private googleApi : GoogleGeoCodeApi ){
    console.log('construction');
    /*
    this.googleApi.handlePlacesAutoComplete( this.restaurantSearchTerm$ )
      .subscribe( (res) => {
        console.log(res);
      })*/

    this.autoCompleteObservable = this.googleApi.handlePlacesAutoComplete( this.restaurantSearchTerm$ );

  }

  ngOnInit() : void {

    this.api
      .getAllRestaurants()
      .then( res => this.restaurants = res );


  }

  addRatingBtn(restaurantPlaceId,food,grade,date,price) : void{
    this.api
      .postAddRating({
        google_place_id : restaurantPlaceId,
        food_name       : food,
        grade : grade,
        date : date,
        price_range : price
      })
      .then( res => alert('success') );
  }
}

@Component({
  selector: 'add-restaurant-view',
  templateUrl: '../views/add-restaurant-form-view.html',
  styleUrls: ['../app.component.css']
})
export class AddRestaurantView implements OnInit{
  types : string[];
  constructor( private api : Api , private googleGeocodeApi : GoogleGeoCodeApi ){
  }

  ngOnInit() : void {
    this.api
      .getFoodTypes()
      .then( res => this.types = res );
  }

  addRestaurantBtn(type,name,addr) : void {
    this.googleGeocodeApi
      .getLatandLngFromAddress(addr)
      .then( (googleResult) => {
        let lat = googleResult.geometry.location.lat;
        let lng = googleResult.geometry.location.lng;
        alert(lat + '/'+lng);
        this.api.postAddRestaurant({
          type : type,
          name : name,
          lat : lat,
          lng : lng,
          address : addr
        }).then( res => alert('success') );
      });
  }
}

@Component({
  selector: 'add-meal-view',
  templateUrl: '../views/add-meal-form-view.html',
  styleUrls: ['../app.component.css']
})
export class AddMealView implements OnInit{
  types : string[];
  constructor( private api : Api ){
  }

  ngOnInit() : void {
    this.api
      .getFoodTypes()
      .then( res => this.types = res );
  }
}

