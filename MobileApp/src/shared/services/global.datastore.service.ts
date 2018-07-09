/**
 * Created by areynolds2 on 11/7/2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class DataStore{
  public lat : number;
  public lng : number;
  public location : string;
  public userId : number;

  constructor(){}

  setLocation(locName : string , lat : number , lng : number ) {
    this.location = locName;
    this.lat = lat;
    this.lng = lng;
  }

  setUser( id : number ){
    this.userId = id;
  }
}
