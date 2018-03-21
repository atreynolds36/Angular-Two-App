/**
 * Created by areynolds2 on 8/15/2017.
 */
import *  as express from 'express';
import { Router , Request , Response } from 'express';
import { Connector } from '../Database_Connect/connect';

import { Restaurant_Schema , Ratings_Schema, Meals_Schema , Restaurant , Rating , MongoDocument } from '../types/API_Incoming_Payload';

/*
 DEFINES THE /get API ROUTE
 */

export class ModifyRouter{
    router : Router;
    connector : Connector;

    static bootstrap() : Router {
        return new ModifyRouter().router;
    }

    constructor(){
        this.router = express.Router();
        this.configRoutes();
        this.connector = Connector.bootstrap()
    }

    configRoutes(){
        this.router.post('/restaurant/:id' , this.updateRestaurantRoute.bind(this) );
        this.router.post('/rating/:id' , this.updateRating.bind(this) );
        //this.router.post('/meal/:id' , this.updateMeal.bind(this) );
    }

    private updateRestaurantRoute(req : Request , res : Response ){
        let restaurantToModify = new Restaurant(req.body);
        this.updateHandler(req,res,'restaurants' , restaurantToModify , req.params.id );
    }

    private updateRating(req : Request , res : Response ){
        let ratingToModify = new Rating(req.body);
        this.updateHandler(req,res, 'ratings' , ratingToModify , req.params.id);
    }

    private updateHandler(req: Request, res : express.Response , collection : string , document : MongoDocument , id : string ){
        if( document.validate() ){
            this.connector.update(collection , id , document , (err, newDoc) => {
                if(err)
                    res.status(400).send({ error : err.message });
                else
                    res.status(201).send({ create : { data : newDoc } });
            })
        } else{
            res.status(416).send({ failedValidation : true });
        }
    }
}

class PostRequestValidator{
    static validatePayload(schema : Array<string> , payload) : boolean{
        let success = true;
        schema.forEach( (str) => {
            if( payload[str] === undefined ){
                success = false;
                return false;
            }
        });
        return success;
    }
}