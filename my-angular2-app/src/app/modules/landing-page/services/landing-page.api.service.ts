/**
 * Created by areynolds2 on 10/30/2017.
 */
import { Injectable , EventEmitter }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Restaurant , Rating , APIQueryResults}           from '../../../types/API_Consumption_Types';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LandingPageApiService {
  // Resolve HTTP using the constructor
  constructor (private http: Http) {}
  // private instance variable to hold base url
  private apiEndpoint  = 'http://localhost:2041';

  onGetRestaurantList : EventEmitter< Restaurant[] > = new EventEmitter();
  onGetRatingsList : EventEmitter<Rating[]> = new EventEmitter();

  getRatingsByUser( userid : number) : Observable<Response>{
    let queryStr : string = "filter=byUser&userId=" + userid;
    return this.http.get(this.apiEndpoint + "/query/ratings?" + queryStr);
  }


  getTopRatedRestaurantsInArea(lat : number , lng : number ) : Observable<Restaurant[]>{
    let queryStr : String = 'filter=topInArea&lat=' + lat + "&lng=" + lng;
    return this.http.get(this.apiEndpoint + "/query/restaurants?" + queryStr)
      .map( (res : Response ) => {
        this.onGetRestaurantList.emit( res.json().results as Restaurant[] )
        console.log('http return');
      })
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

  getRestautantsByCusine(type : string , lat : number, lng : number ){
    let queryStr : String = 'filter=foodType&type=' + type + '&lat=' + lat + "&lng=" + lng;
    return this.http.get(this.apiEndpoint + "/query/restaurants?" + queryStr)
      .map( ( res : Response ) => {
        let results = res.json().results as Restaurant[];
        this.onGetRestaurantList.emit( results );
        return results;
      })
      .catch(this.handleError);
  }

  getRatingsByFoodType( type : string , lat : number , lng : number ) : Observable<Rating[]> {
    let queryStr : String = 'filter=foodType&food=' + type + '&lat=' + lat + "&lng=" + lng;
    return this.http.get(this.apiEndpoint + "/query/ratings?" + queryStr)
      .map( (res : Response) => res.json().results as Rating[] )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
