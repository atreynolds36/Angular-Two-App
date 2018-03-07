import *  as express from 'express';
import { Router , Request , Response } from 'express';
import { Connector } from '../../Database_Connect/connect';

import { Restaurant , Rating , MongoDocument } from '../../types/API_Incoming_Payload';

import { GoogleAPIConnector } from '../google-api-connect';

/*
 DEFINES THE /create API ROUTE
 */

export class CreateRouter{
    router : Router;
    connector : Connector;

    static bootstrap() : Router {
        return new CreateRouter().router;
    }

    constructor(){
        this.router = express.Router();
        this.configRoutes();
        this.connector = Connector.bootstrap()
    }

    configRoutes(){
        this.router.post('/rating' , this.newAndImproveAddRatingRoute.bind(this) );
        this.router.post('/masterdata/food-item' , this.addMasterDataFood.bind(this) );
    }

    private addMasterDataFood(req : Request, res : express.Response ) {
        let newValue = req.body.value;
        if (newValue) {
            newValue = newValue.toUpperCase();
            this.connector.AddToMasterData('FoodMasterData', newValue , (err,object) => {
                if(err)
                    res.status(400).send();
                else
                    res.status(201).send(object);
            })
        }else{
            res.status(400).send({ 'error' : 'Missing value field in payload'});
        }
    }

    private async newAndImproveAddRatingRoute(req : Request , res : express.Response ){
        let restaurant : Restaurant = await GoogleAPIConnector.getPlaceByPlaceId(req.body.google_place_id);
        this.connector.fetchOrAddRestaurant( restaurant , (err , dbRestaurant : MongoRestaurant ) => {
            if(err){
                res.status(400).send();
            }else{
                let newRating = new Rating( req.body );
                if( newRating.validate() ){
                    this.addRating( newRating , dbRestaurant , res );
                } else
                    res.status(416).send({ failedValidation : true } )
            }
        });
    }

    private addRating( rating : Rating , myRestaurant : MongoRestaurant , res : express.Response ){
        this.addFoodTypeToMasterData( rating.food_name );
        this.connector.updateByQueryAddToArray(
            { _id : myRestaurant._id   } ,
            { 'ratings' : rating.get() } ,
            (err : Error , updatedDoc ) => {
                if(err)
                    res.status(400).send({ error : true });
                else{
                    console.log(updatedDoc);
                    res.status(201).send({ create : { data : updatedDoc } });
                }
            })
    }

    private addFoodTypeToMasterData( foodType : string ){
        this.connector.AddToMasterData( 'FoodMasterData' , foodType , (err, doc) => {
            if(err)
                console.error(err);
            else
                console.log('Successful update for ' + foodType );
        });
    }
}