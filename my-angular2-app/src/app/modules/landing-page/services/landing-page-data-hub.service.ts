/**
 * Created by areynolds2 on 10/31/2017.
 */
import { Injectable , EventEmitter }     from '@angular/core';
import { LandingPageApiService } from './landing-page.api.service';
import {Rating, Restaurant } from "../../../types/db_objects";

import {Observable, Subject} from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export interface PageState{
  Rating
  Restaurant
}

@Injectable()
export class LandingPageDataHub{
    // private instance variable to hold base url
    private apiEndpoint  = 'http://localhost:2041';
    private observable : Observable<any>;

    restaurantList : Restaurant[];
    ratingsList : Rating[];

    listUpdate

    private subject = new Subject< Restaurant[] >();

    getRestaurantList(lat : number ,lng : number ){
      if( this.restaurantList ){
        return Observable.of(this.restaurantList);
      }else if( this.observable ){
        return this.observable;
      }else{
        let queryStr : String = 'filter=topInArea&lat=' + lat + "&lng=" + lng;
        console.log('send req');
        this.observable = this.http.get(this.apiEndpoint + "/query/restaurants?" + queryStr)
          .map( (res : Response ) => {
            this.restaurantList = res.json().results as Restaurant[];
            console.log('hit next');
            this.subject.next( this.restaurantList );
            return this.restaurantList;
          })
          .catch(this.handleError);
        return this.observable;
      }
    }

    getRestautantsByCusine(type : string , lat : number, lng : number ){
      let queryStr : String = 'filter=foodType&type=' + type + '&lat=' + lat + "&lng=" + lng;
      return this.http.get(this.apiEndpoint + "/query/restaurants?" + queryStr)
        .map( ( res : Response ) => {
          this.restaurantList = res.json().results as Restaurant[];
          return this.restaurantList;
        })
        .catch(this.handleError);
    }


    dataListEmitter : EventEmitter< Restaurant[] > = new EventEmitter();

    constructor( private api : LandingPageApiService , private http : Http ){
      this.api.onGetRestaurantList.subscribe( (results) => {
        this.restaurantList = results;
        console.log('set in data hub');
      });
      this.api.onGetRatingsList.subscribe( (results) => {
        this.ratingsList = results;
      })
    }

    getCurrentList() : Observable<any> {
      /*
      if( this.restaurantList )
        return Observable.of( this.restaurantList );
      else if( this.observable ){
        return this.observable;
      }
      else{
        console.error('observable undefined and restaurantlist undefined')
      }*/
      return this.subject.asObservable();
    }


    loadLocalRestaurantList(lat : number ,lng : number)  {

      let queryStr : String = 'filter=topInArea&lat=' + lat + "&lng=" + lng;
      console.log('send req');
      this.observable = this.http.get(this.apiEndpoint + "/query/restaurants?" + queryStr)
        .map( (res : Response ) => {
          this.restaurantList = res.json().results as Restaurant[];
          console.log('hit next');
          this.subject.next( this.restaurantList );
          return this.restaurantList;
        })
        .catch(this.handleError);
      return this.observable;
    }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
