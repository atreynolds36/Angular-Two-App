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
        this.router.get('/places/byId' , this.handlePlaceByPlaceId.bind(this) );
    }

    placeAutoCompleteFn(req : Request, res : Response){
        let urlParamStr = req.url.substr( req.url.indexOf('?') );
        console.log(urlParamStr);
        request({
            url : GOOGLE_PLACES_URI + urlParamStr
        }).pipe(res);
    }

    async handlePlaceByPlaceId( req : express.Request , res : express.Response ){
        let placeId = req.query.placeId;
        if( placeId ){
            let restaurant : Restaurant = await GoogleAPIConnector.getPlaceByPlaceId( placeId );
            res.status(200).send(restaurant);
        } else{
            res.status(406).send({ invalidRequest : 'placeId param is required'});
        }
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