/**
 * Created by areynolds2 on 10/27/2017.
 */
import {Component , OnChanges , OnInit , Input } from '@angular/core';

import { Restaurant , Rating } from '../../../../types/API_Consumption_Types';

import { LandingPageApiService } from '../../services/landing-page.api.service';
import {LandingPageDataHub} from "../../services/landing-page-data-hub.service";

import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'list-view-component',
  templateUrl: './list-view.template.html'
})
export class ListViewComponent implements OnInit {
  @Input() restaurantList : Restaurant[] ;

  subscription : Subscription;
  constructor( private datahub : LandingPageDataHub ,  private newApi : LandingPageApiService ){
    console.log('construction');
  }

  ngOnInit(){
  }

}
