import { Component } from '@angular/core';
import {DataStore} from "../../shared/services/global.datastore.service";
import {AutocompleteApiService} from "../../shared/services/autocomplete-api-service";
import {GoogleLocation} from "../../shared/types/api";
import {OptionsList} from "../../shared/types/ui-types";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {LoadingController, NavController} from "ionic-angular";
import {ApiService} from "../../shared/services/api-service";
import {PageDataHub} from "../../shared/services/page-data-hub.service";

@Component({
  templateUrl : 'LocationModal.html'
})
export class LocationModal{
  currentLocation : string;

  searchResultListObservable : Observable< OptionsList[] >;
  locationSubject$ = new Subject<string>();


  constructor(private datastore : DataStore , autocompleteService : AutocompleteApiService , public loadingCntrl : LoadingController ,
              private api : ApiService , public nav : NavController , private datahub : PageDataHub ){
    this.currentLocation = datastore.location;

    this.searchResultListObservable = autocompleteService.handleAutoCompleteByGoogleLocality( this.locationSubject$ )
      .map( ( locationList : GoogleLocation[] ) => {
        return locationList.map( ( location ) => {
          return <OptionsList>{ val : location.place_id , label : location.description }
        });
      });
  }


  setLocation( newLocationId : string ){
    let loadingMod = this.loadingCntrl.create({ spinner : 'dots' });
    loadingMod.present();
    this.api.getLocalityDataFromPlaceId(newLocationId)
      .then( (data) => {
        this.datastore.setLocation( data.address , data.lat , data.lng );
        this.datahub.triggerRefreshStream( data.address );
        loadingMod.dismiss().then( () => this.nav.pop() );
      })
  }
}
