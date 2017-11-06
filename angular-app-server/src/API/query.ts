import *  as express from 'express';
import { Router , Request , Response } from 'express';

/*
 DEFINES THE /get API ROUTE
 */

import { Connector } from '../Database_Connect/connect';

import { Restaurant_Schema , Ratings_Schema, Meals_Schema } from '../types/API_Incoming_Payload';

import { QueryResponse } from '../types/response-structures';

import { BaseQueryHandler } from './QueryEndpoint/base';

import { QueryResults } from './Shim/query-results';

import RestaurantQueryHandler from './QueryEndpoint/RestaurantEndPointDelegator';
import RatingsQueryHandler from './QueryEndpoint/RatingsEndPointDelegator';

/*
 DEFINES THE /get API ROUTE
 */

export class QUERYRouter{
    router : Router;
    connector : Connector;
    restaurantQueryHandler : BaseQueryHandler;
    ratingsQueryHandler : BaseQueryHandler;

    static bootstrap() : Router {
        return new QUERYRouter().router;
    }

    constructor(){
        this.router = express.Router();
        this.configRoutes();
        this.connector = Connector.bootstrap();
        this.restaurantQueryHandler = new BaseQueryHandler();
        this.ratingsQueryHandler = new BaseQueryHandler();
    }

    configRoutes(){
        this.router.get('/ratings' , this.getQueryRatings.bind(this) );
        this.router.get('/restaurants' , this.getQueryRestaurants.bind(this) );
        this.router.get('/restaurants/test' , this.getQueryRestaurantsAll.bind(this) );
    }
    /*
        GET Ratings by Restaurant Id
     */

    private getQueryRatings(req : Request , res : Response ){
        let params = req.query;
        let handler = RatingsQueryHandler(params.filter);
        if(handler){
            handler.execute(params , (err, results ) => {
                if(err)
                    res.status(404).send({ error : err.message} );
                else
                    res.status(200).send( QueryResults.transformIntoOutGoingResults('Ratings' , results) );
            })  ;
        }else{
            res.status(400).send({ error : 'Invalid Query'});
        }
    }

    private getQueryRestaurantsAll(req : Request, res : Response ){
        this.connector.queryAll('central.db' , ((err, results ) => {
            if(err)
                res.status(404).send({ error : err.message} );
            else{
                res.status(200).send(results);
            }
        }))
    }
    /*
        Get restaurants in the area
     */

    private getQueryRestaurants(req : Request , res : Response ){
        let params = req.query;
        //let handler = this.restaurantQueryHandler.getQueryHandler(params.filter);
        let handler = RestaurantQueryHandler(params.filter);
        if(handler){
            handler.execute(params , (err, results ) => {
                if(err)
                    res.status(404).send({ error : err.message} );
                else
                    res.status(200).send( QueryResults.transformIntoOutGoingResults('Restaurants' , results) );
            })  ;
        }else{
            this.queryAllRestaurants(req,res);
        }
    }

    private queryAllRestaurants(req: Request, res : Response ){
        this.connector.queryAll('central.db' , (err, docs) => {
            if(err)
                res.status(400).send({ error : true });
            else
                res.status(200).send( QueryResults.transformIntoOutGoingResults('Restaurants' , docs) );
        })
    }
}