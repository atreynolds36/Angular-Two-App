import { Component } from "@angular/core";
import {AbstractListPageClass} from "../page-component-abstract-class";
import {DataStore} from "../../../../services/global.datastore.service";
import {DisplayListType} from "../../enums";
import {LandingPageDataHub} from "../../services/landing-page-data-hub.service";


@Component({
  templateUrl: '../main/template.html'
})
export class UserReviewListComponent extends AbstractListPageClass {
    constructor( private ds : DataStore , private datahub : LandingPageDataHub ){
      super( ds );
    }

    ngOnInit(){
      super.ngOnInit();
      console.log('hits ngOnInit for user review list component');
      this.activeList = DisplayListType.RATINGS;
      this.datahub.getUserRatingsList( this.ds.userId )
        .subscribe( (ratingsList) => {
            console.log('hit user list');
            this.ratingsList = ratingsList;
        });
    }
}
