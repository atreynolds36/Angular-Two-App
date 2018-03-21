/**
 * Created by areynolds2 on 12/1/2017.
 */

/*
    Not public facing
 */
import {Restaurant} from "../types/API_Incoming_Payload";

const yelpApiUri = 'https://api.yelp.com/v3/businesses/search';
const token = 'mVLBirXo7fStVcXvoRFm2M9IHtaVz_BsC1X7L-DUgiuVwl_eFCTmfZcUIcppnPwRbP4u1CeTmeEtr-O_yCJz4JUDhaDj3F2kFZbZCx-x_GRdFZB94_UhVNwC7qchWnYx';
import * as request from 'request';

export class YelpApiConnector{

    static async getRestaurantCusinesTypesByLatAndLngAndName( resName : string , lat : number ,lng : number ) : Promise< Array<string> > {
        return new Promise( ( resolve : (strs : Array<string> ) => void , rej : (err) => void ) => {
            request({
                url : yelpApiUri + "?term=" + resName + "&latitude=" + lat + "&longitude=" + lng + "&radius=20",
                headers : {
                    authorization : "Bearer " + token
                }
            } , (err , res , body ) => {
                if(err)
                    rej(err);
                else if(body && body.error )
                    rej( body.error );
                else{
                    let businesses = JSON.parse( body ).businesses;
                    if( businesses.length == 0 ){
                        resolve( [] as Array<string> );
                    }else{
                        if( businesses.length > 1 ) {
                            console.error('Found more than one in area - possible issues');
                        }
                        let types : Array<string> = businesses[0].categories.map( (kv ) => {
                            return kv.alias;
                        });
                        resolve( types );
                    }
                }
            })
        });
    }
}