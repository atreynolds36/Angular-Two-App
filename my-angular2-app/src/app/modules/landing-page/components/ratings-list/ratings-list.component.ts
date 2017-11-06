/**
 * Created by areynolds2 on 11/2/2017.
 */
import {Component , OnChanges , OnInit , Input } from '@angular/core';

import { Restaurant , Rating } from '../../../../types/db_objects';

@Component({
  selector: 'ratings-list-component',
  templateUrl: './template.html'
})
export class RatingsListComponent implements OnChanges {
  @Input() ratingsList : Rating[];
  myList : Rating[];
  constructor(){

  }
  ngOnChanges(){
    console.log('updated list');
  }
}
