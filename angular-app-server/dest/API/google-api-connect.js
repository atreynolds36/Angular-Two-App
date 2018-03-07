"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const request = require("request");
const API_Incoming_Payload_1 = require("../types/API_Incoming_Payload");
const GOOGLE_PLACES_URI = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const GEOCODING_KEY = 'AIzaSyDIZr3mm1bXSybMxtVxpGBpNjXiWstpiUw';
const geocodingGMApiUri = 'https://maps.googleapis.com/maps/api/geocode/json?key=';
const google_places_fetch_uri = 'https://maps.googleapis.com/maps/api/place/details/json?key=' + GEOCODING_KEY;
class GoogleAPIConnector {
    static bootstrap() {
        return new GoogleAPIConnector().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
    }
    configRoutes() {
        this.router.get('/places/auto-complete', this.placeAutoCompleteFn.bind(this));
    }
    placeAutoCompleteFn(req, res) {
        let urlParamStr = req.url.substr(req.url.indexOf('?'));
        console.log(urlParamStr);
        request({
            url: GOOGLE_PLACES_URI + urlParamStr
        }).pipe(res);
    }
    static getLatAndLngFromAddress(address, callbackFn) {
        request({
            url: geocodingGMApiUri + "&address=" + address
        }, (err, responseCode, body) => {
            if (err) {
                console.error('Could not find ' + address);
                callbackFn(err);
            }
            else {
                let latLngObject = body.results[0];
                let lat = Number(latLngObject.geometry.location.lat);
                let lng = Number(latLngObject.geometry.location.lng);
                console.log(lat + "!" + lng);
                callbackFn(null, lat, lng);
            }
        });
    }
    static getPlaceByPlaceId(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                request({
                    url: google_places_fetch_uri + "&placeid=" + placeId
                }, (err, responseCode, body) => {
                    if (err)
                        reject(err);
                    else {
                        let jsonResult = JSON.parse(body).result;
                        let restaurantInstance = new API_Incoming_Payload_1.Restaurant({
                            gid: placeId,
                            address: jsonResult.formatted_address,
                            name: jsonResult.name,
                            lat: jsonResult.geometry.location.lat,
                            lng: jsonResult.geometry.location.lng
                        });
                        resolve(restaurantInstance);
                    }
                });
            });
        });
    }
}
exports.GoogleAPIConnector = GoogleAPIConnector;
