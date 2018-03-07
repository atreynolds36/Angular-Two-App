import {Component, OnInit, Input , AfterViewInit } from '@angular/core';

import { Api } from '../../../../../services/api.service';

import { Restaurant , Rating } from '../../../../../types/API_Consumption_Types';
@Component({
  selector: 'krv-restaurant-marker',
  templateUrl: './restaurant-marker.template.html',
  styleUrls: []
})

export class KrvMarker implements AfterViewInit {
  ratings : Rating[];
  constructor( private api : Api ){
    console.log('Constructed a marker');
  }
  @Input() marker : Restaurant;
  ngAfterViewInit() : void {
    console.log('AT ' + this.marker.lat + "//" + this.marker.lng );
  }

  loadRestaurantRatings(id){
    this.api.getRatingsByRestaurant(id)
      .then( (ratings) => { this.ratings = ratings });
  }
}

@Component({
  selector: 'krv-rating-marker',
  templateUrl: './ratings-marker.template.html',
  styleUrls: []
})
export class KrvRatingMarker implements AfterViewInit {
  ratings : Rating[];
  constructor( private api : Api ){}
  @Input() marker : Rating;
  ngAfterViewInit() : void {
  }

  loadRestaurantRatings(id){
    /*this.api.getRatingsByRestaurant(id)
      .then( (ratings) => { this.ratings = ratings });
    */
  }
}

