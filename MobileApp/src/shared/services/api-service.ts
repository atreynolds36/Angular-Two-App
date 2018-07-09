/**
 * Created by areynolds2 on 10/30/2017.
 */
import { Injectable , EventEmitter }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Restaurant , Rating , APIQueryResults}           from '../types/api';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {DataStore} from "./global.datastore.service";

@Injectable()
export class ApiService {
  // Resolve HTTP using the constructor
  constructor (private http: Http , public appData : DataStore) {}
  // private instance variable to hold base url
    private apiEndpoint  = 'http://localhost:2041';
  //private apiEndpoint = 'http://192.168.1.20:2041';

  onGetRestaurantList : EventEmitter< Restaurant[] > = new EventEmitter();
  onGetRatingsList : EventEmitter<Rating[]> = new EventEmitter();

  getRatingsByUser( userid : number) : Observable<Response>{
    let queryStr : string = "filter=byUser&userId=" + userid;
    return this.http.get(this.apiEndpoint + "/query/ratings?" + queryStr);
  }

  getRestaurantById( id : string ) : Promise<Restaurant>{
    return this.http.get(this.apiEndpoint + "/get/restaurant/" + id )
      .map( res => res.json() )
      .toPromise()
      .catch(this.handleError);
  }

  getTopRatedRestaurantsInArea() : Observable<Restaurant[]>{
    let queryStr : String = 'filter=topInArea&lat=' + this.appData.lat + "&lng=" + this.appData.lng;
    return this.http.get(this.apiEndpoint + "/query/restaurants?" + queryStr)
      .map(  res => res.json().results as Restaurant[] )
      .catch(this.handleError);
  }

  getRestaurantsByType( type : string , lat : number , lng : number ) : Observable<Restaurant[]> {
    let queryStr : String = 'filter=foodType&type=' + type + '&lat=' + lat + "&lng=" + lng;
    return this.http.get(this.apiEndpoint + "/query/restaurants?" + queryStr)
      .map( ( res : Response ) => {
        let results = res.json().results as Restaurant[];
        this.onGetRestaurantList.emit( results );
      })
      .catch(this.handleError);
  }

  getRatingsByCuisine( type : string ) : Observable<Rating[]>{
    let queryStr = "filter=byCuisine&type=" + type + "&lat=" + this.appData.lat + "&lng=" + this.appData.lng;
    return this.http.get( this.apiEndpoint + "/query/ratings?" + queryStr )
      .map(  res => res.json().results as Rating[] )
      .catch(this.handleError);
  }

  postAddRating(payload) : Promise<any>{
    return this.http.post(this.apiEndpoint + '/create/rating' , payload )
      .toPromise()
      .then(response => response.json() as Object)
      .catch(this.handleError);
  }

  getRatingsByFoodType( type : string ) : Observable<Rating[]> {
    let queryStr : String = 'filter=foodType&food=' + type + '&lat=' + this.appData.lat + "&lng=" + this.appData.lng;
    return this.http.get(this.apiEndpoint + "/query/ratings?" + queryStr)
      .map( (res : Response) => res.json().results as Rating[] )
      .catch(this.handleError);
  }

  getLocalityDataFromPlaceId( placeId : string ){
    return this.http.get(this.apiEndpoint + "/google-api/places/byId?placeId=" + placeId )
      .map( res => res.json() )
      .toPromise()
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
