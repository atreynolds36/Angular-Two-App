/**
 * Created by areynolds2 on 10/31/2017.
 */
import { Injectable , EventEmitter }     from '@angular/core';
import { ApiService } from './api-service';
import {Rating, Restaurant } from "../types/api";

import {Observable, Subject} from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {DataStore} from "./global.datastore.service";

export interface PageState{
  Rating
  Restaurant
}

@Injectable()
export class PageDataHub{
    // private instance variable to hold base url
    private observable : Observable<any>;

    private restaurantList : Restaurant[];
    private ratingsList : Rating[];

    private refreshSubjectStream = new Subject<string>();

    userRatingsList : Rating[];
    userObservable : Observable<Rating[]>;

    getUserRatingsList( userid : number ) : Observable<Rating[]>{
      if( this.userRatingsList ) {
        return Observable.of( this.userRatingsList );
      }else if( this.userObservable ){
        return this.userObservable
      }else{
        return this.api.getRatingsByUser( userid ).map( (res) => {
          this.userRatingsList = res.json().results as Rating[];
          return this.userRatingsList;
        });
      }
    }

    getRefreshStream() : Subject<string>{
      return this.refreshSubjectStream;
    }

    triggerRefreshStream( str : string ) : void{
      this.restaurantList = undefined;
      this.refreshSubjectStream.next(str);
    }

    getRestaurantListObservable(){
      if( this.restaurantList ){
        return Observable.of(this.restaurantList);

      }
      //else if( this.observable ){
      //  return this.observable;
      //}
      else{
        this.observable = this.api.getTopRatedRestaurantsInArea();
        this.observable.toPromise().then( ( restaurantList : Restaurant[] ) => {
          this.restaurantList = restaurantList;
        });
        return this.observable;
      }
    }

    getCurrentRestaurantList() : Restaurant[] {
      console.log('get current restaurant list');
      return this.restaurantList;
    }


    dataListEmitter : EventEmitter< Restaurant[] > = new EventEmitter();

    constructor( private api : ApiService , private http : Http , private datastore : DataStore ){
      this.api.onGetRestaurantList.subscribe( (results) => {
        this.restaurantList = results;
        console.log('set in data hub');
      });
      this.api.onGetRatingsList.subscribe( (results) => {
        this.ratingsList = results;
      })
    }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
