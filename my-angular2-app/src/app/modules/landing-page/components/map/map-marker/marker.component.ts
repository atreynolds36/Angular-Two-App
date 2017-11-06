import {Component, OnInit, Input , AfterViewInit } from '@angular/core';

import { Api } from '../../../../../services/api.service';

import { Restaurant , Rating } from '../../../../../types/db_objects';
@Component({
  selector: 'krv-marker',
  templateUrl: './marker.template.html',
  styleUrls: []
})

export class KrvMarker implements AfterViewInit {
  ratings : Rating[];
  constructor( private api : Api ){}
  @Input() marker : Restaurant;
  ngAfterViewInit() : void {
  }

  loadRestaurantRatings(id){
    this.api.getRatingsByRestaurant(id)
      .then( (ratings) => { this.ratings = ratings });
  }
}
