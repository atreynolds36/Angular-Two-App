/**
 * Created by areynolds2 on 11/7/2017.
 */
import { Injectable } from '@angular/core';
import {Http , Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Cuisine, GoogleLocation, MasterData} from "../types/api";
import {DataStore} from "./global.datastore.service";

@Injectable()
export class AutocompleteApiService{
  constructor (private http: Http , private datastore : DataStore ) {}
  // private instance variable to hold base url
  private apiEndpoint  = 'http://localhost:2041';
  private googleApiKey = 'AIzaSyBGl1fMQneNqJqqco8G-Ptluhm7qkd01B8';

  public handleAutoCompleteByFood( str : Subject<string> ){
    return str
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.autoCompleteByFood(term));
  }

  private autoCompleteByFood( val : string ) : Observable<MasterData[]> {
    return this.http.get(this.apiEndpoint + "/masterdata/food-types?filter=" + val )
      .map( (res : Response) => {
        return res.json();
      })
  }
  /////////////////////////////////////////////////////////////////////////////////
  public handleAutoCompleteByGoogleLocation( str : Subject<string> ){
    return str
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.autoCompleteByGoogleEstablishmnet(term));
  }
  private autoCompleteByGoogleEstablishmnet( val : string ) : Observable<GoogleLocation[]>{
    let uri = "/google-api/places/auto-complete?key=" + this.googleApiKey + "&input=" + val +
        "&location=" + this.datastore.lat + "," + this.datastore.lng + "&radius=500&types=establishment";
    return this.http.get(this.apiEndpoint + uri )
      .map( (res : Response ) => {
        return res.json().predictions;
      })
  }
  ///////////////////////////////////////////////////////////////////
  public handleAutoCompleteByGoogleLocality( str : Subject<string>){
    return str
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.autoCompleteByGoogleLocality(term));
  }
  private autoCompleteByGoogleLocality( val : string ) : Observable<GoogleLocation[]>{
    let uri = "/google-api/places/auto-complete?key=" + this.googleApiKey + "&input=" + val +
      "&types=(cities)";
    return this.http.get(this.apiEndpoint + uri )
      .map( (res : Response ) => {
        return res.json().predictions;
      })
  }
  /////////////////////////////////////////////////////////////////////
  public handleAutoCompleteByCuisine( str : Subject<string> ){
    return str
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.autoCompleteByCuisine(term) );
  }

  private autoCompleteByCuisine( val : string ) : Observable<Cuisine[]> {
    return this.http.get(this.apiEndpoint + "/masterdata/cuisine-types?filter=" + val )
      .map( (res : Response) => {
        return res.json();
      })
  }

}
