import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Restaurant , Rating } from '../types/db_objects';
import { GeoCodeResponseData } from '../types/google_api_types';
import {ExternalHttp } from "../config/external_http";

const GMAPS_API_KEY = 'AIzaSyBGl1fMQneNqJqqco8G-Ptluhm7qkd01B8';
const geocodingGMApiUri = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + 'AIzaSyDIZr3mm1bXSybMxtVxpGBpNjXiWstpiUw';

@Injectable()
export class GoogleGeoCodeApi {
  constructor(private http: ExternalHttp) {}

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
}
