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
const yelpApiUri = 'https://api.yelp.com/v3/businesses/search';
const token = 'mVLBirXo7fStVcXvoRFm2M9IHtaVz_BsC1X7L-DUgiuVwl_eFCTmfZcUIcppnPwRbP4u1CeTmeEtr-O_yCJz4JUDhaDj3F2kFZbZCx-x_GRdFZB94_UhVNwC7qchWnYx';
const request = require("request");
class YelpApiConnector {
    static getRestaurantCusinesTypesByLatAndLngAndName(resName, lat, lng) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, rej) => {
                request({
                    url: yelpApiUri + "?term=" + resName + "&latitude=" + lat + "&longitude=" + lng + "radius=20",
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (err, res, body) => {
                    if (err)
                        rej(err);
                    else {
                        let businesses = body.businesses;
                        if (businesses.length == 0) {
                            resolve([]);
                        }
                        else {
                            if (businesses.length > 1) {
                                console.error('Found more than one in area - possible issues');
                            }
                            let types = body.businesses[0].categories.map((kv) => {
                                return kv.alias;
                            });
                            resolve(types);
                        }
                    }
                });
            });
        });
    }
}
exports.YelpApiConnector = YelpApiConnector;
