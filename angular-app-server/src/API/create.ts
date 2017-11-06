import *  as express from 'express';
import { Router , Request , Response } from 'express';
import { Connector } from '../Database_Connect/connect';

import { Restaurant_Schema , Ratings_Schema, Meals_Schema } from '../types/API_Incoming_Payload';
import { Restaurant , Rating , MongoDocument } from '../types/API_Incoming_Payload';

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
        this.router.post('/restaurant' , this.createRestaurantRoute.bind(this) );
        this.router.post('/rating' , this.createRating.bind(this) );
        this.router.post('/masterdata/food-item' , this.addMasterDataFood.bind(this) );
    }

    private addMasterDataFood(req : Request, res : Response ) {
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

    private createRestaurantRoute(req : Request , res : Response ){
        let newInstance = new Restaurant(req.body);
        //this.createHandler(req,res,'restaurants' , newInstance );
        if( newInstance.validate() ){
            this.connector.newAdd(newInstance , (err,newDoc) => {
                if(err)
                    res.status(400).send({ error : true });
                else
                    res.status(201).send({ create : { data : newDoc } });
            })
        }else {
            res.status(416).send({ failedValidation : true } );
        }
    }


    private createRating(req : Request , res : Response ){
        let ratingToAdd = new Rating(req.body);
        if( ratingToAdd.validate() ){
            //Add to food masterdata if it doesnt exist
            //todo - better way to do this if we do this live
            this.connector.AddToMasterData( 'FoodMasterData' , ratingToAdd.food_name , (err, doc) => {
                if(err)
                    console.error(err);
                else
                    console.log('Successful update for ' + ratingToAdd.food_name );
            });
            this.connector.findToModify('central.db' , ratingToAdd.restaurant_id , (err : Error , doc : any ) => {
                if(err)
                    res.status(400).send({ error : true });
                else{
                    //Look for similiar rating - if not there, just add - if there - combine
                    let ratingNode;
                    console.log(doc.ratings.length);
                    //Todo will eventually be a more better way to do this - much more better
                    doc.ratings.forEach(function(node){
                        if( node.food.toUpperCase() == ratingToAdd.food_name.toUpperCase() ) {
                            ratingNode = node;
                            return false;
                        }
                    });
                    console.log(doc);
                    if(ratingNode){
                        console.log('Rating defined' + ratingNode.food );
                        let total = ratingNode.count * ratingNode.score + ratingToAdd.grade ;
                        ratingNode.count++;
                        let newScore = total/ratingNode.count;
                        ratingNode.score = newScore;
                        ratingNode.lastRated = ratingToAdd.date;


                        this.connector.updateByQuery({ _id : doc._id , 'ratings.food' : ratingNode.food } ,
                            { 'ratings.$' : ratingNode } , (err : Error , updatedDoc ) => {
                                if(err)
                                    res.status(400).send({ error : true });
                                else{
                                    console.log(updatedDoc);
                                    res.status(201).send({ create : { data : updatedDoc } });
                                }
                            })
                    } else{
                        ratingNode = {
                            count : 1,
                            score : ratingToAdd.grade,
                            lastRated : ratingToAdd.date,
                            food : ratingToAdd.food_name.toUpperCase()
                        };
                        this.connector.updateByQueryAddToArray({ _id : doc._id   } ,
                            { 'ratings' : ratingNode } , (err : Error , updatedDoc ) => {
                                if(err)
                                    res.status(400).send({ error : true });
                                else{
                                    console.log(updatedDoc);
                                    res.status(201).send({ create : { data : updatedDoc } });
                                }
                            })
                    }
                }
            });
        }else
            res.status(416).send({failedValidation : true });
    }
    /*
        If item has already been rated, update the rating to include the new one
     */
    private createOrModifyExistingRating(req,res, newInstance : Rating ){
        if( newInstance.validate() ){
            let queryForPreviousRating = { restaurant_id : newInstance.restaurant_id , food_name : newInstance.food_name };
            this.connector.query('ratings' , queryForPreviousRating , (err, docs : Array<any>) => {
                if(docs.length){
                    let _id = docs[0]._id;

                }
            });

        } else{
            res.status(416).send({ failedValidation : true });
        }
    }

}