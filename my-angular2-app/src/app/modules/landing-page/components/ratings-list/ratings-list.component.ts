/**
 * Created by areynolds2 on 11/2/2017.
 */
import {Component , OnChanges , OnInit , Input } from '@angular/core';

import { Restaurant , Rating } from '../../../../types/API_Consumption_Types';

@Component({
  selector: 'ratings-list-component',
  templateUrl: './template.html'
})
export class RatingsListComponent implements OnChanges {
  @Input() ratingsList : Rating[];
  constructor(){

  }
  ngOnChanges(){
    console.log('updated list');
  }
}
