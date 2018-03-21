/**
 * Created by areynolds2 on 8/15/2017.
 */
import *  as express from 'express';
import { Router , Request , Response } from 'express';
import { Connector } from '../Database_Connect/connect';

import { Restaurant_Schema , Ratings_Schema, Meals_Schema } from '../types/API_Incoming_Payload';


const cuisineMongoCollectionName = 'Cuisine';
const foodNamesMongoCollectionName = 'FoodMasterData';
/*
 DEFINES THE /get API ROUTE
 */

export class MasterDataRouter{
    router : Router;
    connector : Connector;

    static bootstrap() : Router {
        return new MasterDataRouter().router;
    }

    constructor(){
        this.router = express.Router();
        this.configRoutes();
        this.connector = Connector.bootstrap();
    }

    configRoutes(){
        this.router.get('/cuisine-types' , this.foodGenreRoute.bind(this) );
        this.router.get('/food-types' , this.foodTypes.bind(this) );
    }

    foodGenreRoute(req : Request, res : express.Response ){
        let filter = req.query.filter && req.query.filter.toLowerCase();
        let expr = new RegExp(filter);
        let filterQuery = { 'value' : expr  };
        this.connector.filterMasterdata( cuisineMongoCollectionName , filterQuery , (err , values ?: any) => {
            if(err)
                res.status(400).send({ Error : 'In Masterdata'});
            else
                res.status(200).send(values)
        });
    }

    foodTypes(req : Request, res : express.Response ){
        let filter = req.query.filter && req.query.filter.toUpperCase();
        let expr = new RegExp(filter);
        let filterQuery = { 'values' : expr };
        this.connector.filterMasterdata( foodNamesMongoCollectionName , filterQuery , (err , values ?: any) => {
            if(err)
                res.status(400).send({ Error : 'In Masterdata'});
            else
                res.status(200).send(values)
        });
    }
}