import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Restaurant , Rating , MasterData } from '../types/API_Consumption_Types';

const apiEndpoint = 'http://localhost:2041';

@Injectable()
export class Api{
  constructor( private http : Http ){
    console.log('api construction');
  }

  getTopRatedRestaurantsInArea(lat : Number , lng : Number ) : Promise<Restaurant[]>{
    let queryStr : String = 'filter=topInArea&lat=' + lat + "&lng=" + lng;
    return this.http.get(apiEndpoint + "/query/restaurants?" + queryStr)
        .toPromise()
        .then(response => response.json().results as Restaurant[])
        .catch(this.handleError);
  }

  getRatingsByFoodType( type : string , lat : Number , lng : Number ) : Promise<Rating[]> {
    let queryStr : String = 'filter=foodType&food=' + type + '&lat=' + lat + "&lng=" + lng;
    return this.http.get(apiEndpoint + "/query/ratings?" + queryStr)
      .toPromise()
      .then(response => response.json().results as Rating[])
      .catch(this.handleError);
  }

  getRestaurantsByType( type : string , lat : Number , lng : Number ) : Promise<Restaurant[]> {
    let queryStr : String = 'filter=foodType&type=' + type + '&lat=' + lat + "&lng=" + lng;
    return this.http.get(apiEndpoint + "/query/restaurants?" + queryStr)
      .toPromise()
      .then(response => response.json().results as Restaurant[])
      .catch(this.handleError);
  }

  getFoodMasterDataValues( filter : string ){
    return this.http.get(apiEndpoint + '/masterdata/food-types?filter=' + filter )
      .toPromise()
      .then(response => response.json() as MasterData[])
      .catch(this.handleError);
  }

  getRankings(): Promise<Rating[]> {
    return this.http.get(apiEndpoint + "/get/ratings")
      .toPromise()
      .then(response => response.json().data as Rating[])
      .catch(this.handleError);
  }

  getAllRestaurants() : Promise<Restaurant[]>{
    return this.http.get(apiEndpoint + "/query/restaurants")
      .toPromise()
      .then(response => response.json().results as Restaurant[])
      .catch(this.handleError);
  }

  getRatingsByRestaurant(rest_id : string ) : Promise<Rating[]>{
    return this.http.get(apiEndpoint + "/query/ratings?filter=restaurantId&restaurantId=" + rest_id)
      .toPromise()
      .then(response => response.json().results /*.results*/ as Rating[])
      .catch(this.handleError);
  }

  getFoodTypes() : Promise<string[]>{
    return this.http.get(apiEndpoint + '/masterdata/cuisine-types')
      .toPromise()
      .then(response => response.json() as string[])
      .catch(this.handleError);
  }

  postAddRestaurant(payload) : Promise<any>{
    return this.http.post(apiEndpoint + '/create/restaurant' , payload )
      .toPromise()
      .then(response => response.json() as Object)
      .catch(this.handleError);
  }

  postAddRating(payload) : Promise<any>{
    return this.http.post(apiEndpoint + '/create/rating' , payload )
      .toPromise()
      .then(response => response.json() as Object)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
