/**
 * Created by areynolds2 on 8/15/2017.
 */
import *  as express from 'express';
import { Router , Request , Response } from 'express';
import { Connector } from '../Database_Connect/connect';

import { Restaurant_Schema , Ratings_Schema, Meals_Schema } from '../types/API_Incoming_Payload';

/*
 DEFINES THE /get API ROUTE
 */

export class MasterDataRouter{
    router : Router;

    static bootstrap() : Router {
        return new MasterDataRouter().router;
    }

    constructor(){
        this.router = express.Router();
        this.configRoutes();
    }

    configRoutes(){
        this.router.get('/cuisine-types' , this.foodGenreRoute.bind(this) );
        this.router.get('/:genres/types' , this.foodTypeByGenre.bind(this) );
    }

    foodGenreRoute(req : Request, res : Response){
        res.json([
            "AMERICAN",
            "CHINESE",
            "ITALIAN",
            "MEXICAN",
            "SEAFOOD",
            "MEDITERRANEAN"
        ]);
    }

    foodTypeByGenre(req : Request, res:Response){

    }
}