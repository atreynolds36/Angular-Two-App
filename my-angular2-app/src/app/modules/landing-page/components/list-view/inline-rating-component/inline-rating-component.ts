/**
 * Created by areynolds2 on 10/26/2017.
 */

import {Component , Input } from '@angular/core';

import { Rating } from '../../../../../types/API_Consumption_Types';

@Component({
  selector: 'list-item-rating-component',
  templateUrl: './template.html'
})

export class ListItemRatingComponent {
    @Input() ratingList : Array<Rating>;
    showMore : boolean = false;
    constructor(){}

    showFn(){
      console.log(this.showMore);
      this.showMore = ! this.showMore;
    }
}
