/**
 * Created by areynolds2 on 8/15/2017.
 */
import *  as express from 'express';
import { Router , Request , Response } from 'express';
import { Connector } from '../Database_Connect/connect';
import {RestaurantDO} from "../DataObjects/Restaurant";

/*
 DEFINES THE /get API ROUTE
 */

export class GetRouter{
    router : Router;
    connector : Connector;

    static bootstrap() : Router {
        return new GetRouter().router;
    }

    constructor(){
        this.router = express.Router();
        this.configRoutes();
        this.connector = Connector.bootstrap()
    }

    configRoutes(){
        this.router.get('/restaurant/:id' , this.getRestaurantHandler.bind(this) );
    }

    private getRestaurantHandler(req : Request , res : express.Response ){
        let restaurantId = req.params.id;
        this.connector.getRestaurantById( restaurantId , (err , restaurant : RestaurantDO ) => {
            if(err){
                res.status(400).send( { error : err.message } );
            }else{
                res.status(200).send( restaurant.getAPIOutgoingStructure() );
            }
        });
    }
}