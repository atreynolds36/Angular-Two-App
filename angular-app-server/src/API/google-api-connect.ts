/**
 * Created by areynolds2 on 8/15/2017.
 */
import *  as express from 'express';
import { Router , Request , Response } from 'express';

import * as request from 'request';
import {Restaurant} from "../types/API_Incoming_Payload";

const GOOGLE_PLACES_URI = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const GEOCODING_KEY = 'AIzaSyDIZr3mm1bXSybMxtVxpGBpNjXiWstpiUw';
const geocodingGMApiUri = 'https://maps.googleapis.com/maps/api/geocode/json?key=';
const google_places_fetch_uri = 'https://maps.googleapis.com/maps/api/place/details/json?key=' + GEOCODING_KEY ;
/*
 DEFINES THE /get API ROUTE
 */

export class GoogleAPIConnector{
    router : Router;

    static bootstrap() : Router {
        return new GoogleAPIConnector().router;
    }

    constructor(){
        this.router = express.Router();
        this.configRoutes();
    }

    configRoutes(){
        this.router.get('/places/auto-complete' , this.placeAutoCompleteFn.bind(this) );
    }

    placeAutoCompleteFn(req : Request, res : Response){
        let urlParamStr = req.url.substr( req.url.indexOf('?') );
        console.log(urlParamStr);
        request({
            url : GOOGLE_PLACES_URI + urlParamStr
        }).pipe(res);
    }

    static getLatAndLngFromAddress(address : string , callbackFn : (err : Error , lat ?: number , lng ?: number ) => void ) : void {
        request({
            url : geocodingGMApiUri + "&address=" + address
        } , (err, responseCode , body ) => {
            if(err){
                console.error('Could not find ' + address );
                callbackFn(err);
            }else{
                let latLngObject = body.results[0];
                let lat = Number( latLngObject.geometry.location.lat );
                let lng = Number( latLngObject.geometry.location.lng );
                console.log(lat + "!" + lng );
                callbackFn(null, lat , lng );
            }
        })
    }

    static async getPlaceByPlaceId( placeId : string ) : Promise<Restaurant> {
        return new Promise( (resolve : (res : Restaurant ) => void , reject : (err) => void ) => {
            request({
                url: google_places_fetch_uri + "&placeid=" + placeId
            }, (err, responseCode, body) => {
                if (err)
                    reject(err);
                else {
                    let jsonResult = JSON.parse(body).result;
                    let restaurantInstance = new Restaurant({
                       gid : placeId,
                       address : jsonResult.formatted_address,
                       name : jsonResult.name,
                       lat : jsonResult.geometry.location.lat,
                       lng : jsonResult.geometry.location.lng
                    });
                    resolve( restaurantInstance );
                }
            })
        });
    }
}