import { Injectable } from '@angular/core';
import { Headers, Http , Response , Jsonp } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Restaurant , Rating } from '../types/API_Consumption_Types';
import { GeoCodeResponseData } from '../types/google_api_types';
import {ExternalHttp } from "../config/external_http";
import {Observable} from "rxjs";

import { DataStore } from './global.datastore.service';

const GMAPS_API_KEY = 'AIzaSyBGl1fMQneNqJqqco8G-Ptluhm7qkd01B8';
const geocodingGMApiUri = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + 'AIzaSyDIZr3mm1bXSybMxtVxpGBpNjXiWstpiUw';
const google_places_api = 'http://localhost:2041/google-api/places/auto-complete?key=' + GMAPS_API_KEY;

@Injectable()
export class GoogleGeoCodeApi {
  observePlacesAutocomplete : Observable<any>;

  constructor(private http: ExternalHttp , private datastore : DataStore , private jsonp : Jsonp ) {}

  public getLatandLngFromAddress(addr : string ): Promise<GeoCodeResponseData> {
    return this.http.get(geocodingGMApiUri + "&address=" + addr  )
      .toPromise()
      .then(response => response.json().results[0] as GeoCodeResponseData)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  public handlePlacesAutoComplete( str : Observable<string> ){
    return str
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.sendPlacesAutocompleteRequest(term));
  }

  public sendPlacesAutocompleteRequest(input : string  ): Observable<any>{
    console.log(input);
    let urlStr = this.buildPlaceAutoCompleteUrl( input );
    return this.http.get( google_places_api + "&" + urlStr )
      .map( (res : Response) => res.json().predictions );
  }

  private buildPlaceAutoCompleteUrl(input : string ){
    return 'input=' + input + "&location=" + this.datastore.lat + "," + this.datastore.lng + "&radius=500"; //+ &callback=JSONP_CALLBACK";
  }

}
