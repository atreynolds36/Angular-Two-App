import * as mongodb from 'mongodb';
import { MongoClient , Db , Collection , Cursor } from 'mongodb';

import { Restaurant , Rating } from '../types/API_Incoming_Payload';
import { GoogleAPIConnector } from '../API/google-api-connect';
import {RestaurantDO} from "../DataObjects/Restaurant";
import {YelpApiConnector} from "../API/yelp-api-connect";

const mongo_uri = 'mongodb://localhost:27017/angular';
const object_id = mongodb.ObjectID;

const RestaurantMongoCollectionName = 'central.db';

export class Connector {
    client: MongoClient;
    mongodb: Db;

    static bootstrap(): Connector {
        return new Connector();
    }

    constructor() {
        this.client = mongodb.MongoClient;
        this.connect();
    }

    connect() {
        this.client.connect(mongo_uri, (err, db: Db) => {
            if (err)
                console.error(err);
            else
                this.mongodb = db;
        })
    }

    public async addRestaurant(document: Restaurant, callbackFn: (err: Error, newDoc ?: any) => void) {
        let collection = this.mongodb.collection( RestaurantMongoCollectionName );
        let types = await YelpApiConnector.getRestaurantCusinesTypesByLatAndLngAndName(
            document.name, document.lat, document.lng
        ).catch( (rej) => {
            throw new Error(rej);
        });
        document.cuisineTypesArray = types as Array<string>;

        collection.insertOne(document, (err: Error, newDoc) => {
            if (err)
                callbackFn(err);
            else
                callbackFn(null, newDoc.ops[0]);
        })
    }

    /*
     Update Existing Record by ID
     */
    public update(collectionName: string, documentId: string, document: any, callbackFn: (err: Error, newDoc ?: any) => void): void {
        let collection = this.mongodb.collection(collectionName);
        let docId;
        try {
            docId = new object_id(documentId);
        } catch (err) {
            callbackFn(err);
        }
        collection.findOneAndUpdate({_id: docId}, {$set: document}, (err: Error, updatedDoc) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, updatedDoc);
            }
        })
    }

    /*
     Update Based on Query
     */
    public updateByQuery(queryFilter: any, document: any, callbackFn: (err: Error, newDoc ?: any) => void): void {
        let collection = this.mongodb.collection('central.db');
        collection.findOneAndUpdate(queryFilter, {$set: document}, (err: Error, updatedDoc) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, updatedDoc);
            }
        })
    }

    /*
     Update Based on Query
     */
    public updateByQueryAddToArray(queryFilter: any, document: any, callbackFn: (err: Error, newDoc ?: any) => void): void {
        let collection = this.mongodb.collection('central.db');
        collection.findOneAndUpdate(queryFilter, {$push: document}, (err: Error, updatedDoc) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, updatedDoc);
            }
        })
    }

    /*
     TEST
     */
    public queryAll(collectionName: string, callbackFn: (err: Error, docs ?: Array<any>) => void): void {
        let collection: Collection = this.mongodb.collection(collectionName);

        collection.find().toArray((err, docs) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, docs);
            }
        });
    }

    /*
     Query a collection by queryObject
     */
    public centralQuery( queryObject: Object, callbackFn: (err: Error, docs ?: Array<RestaurantDO>) => void): void {
        this.baseQuery('central.db', queryObject, (err : Error , docs ?: Array<any>) => {
            if(err)
                callbackFn(err);
            else{
                let dataResults = Array<RestaurantDO>();
                for(let d of docs ){
                    dataResults.push( new RestaurantDO( d as MongoRestaurant ) );
                }
                callbackFn(null, dataResults );
            }
        });
    }

    private baseQuery(collectionName: string, queryObject: Object, callbackFn: (err: Error, docs ?: Array<any>) => void): void {
        let collection = this.mongodb.collection(collectionName);
        let questionDoc = collection.find(queryObject);

        questionDoc.toArray((err, docs) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, docs );
            }
        })
    }

    public getRestaurantById(id: string, callbackFn: (err: Error, docs ?: RestaurantDO ) => void): void {
        let collection = this.mongodb.collection('central.db');
        let docId;
        try {
            docId = new object_id(id);
        } catch (err) {
            callbackFn(err);
        }
        let questionDoc = collection.findOne({_id: docId}, (err, doc) => {
            if (doc) {
                let restaurant : RestaurantDO = new RestaurantDO( doc as MongoRestaurant );
                callbackFn(null, restaurant);
            } else
                callbackFn(new Error('Could not find record'));
        });
    }

    public filterMasterdata( dataType: string, queryObject: any, callbackFn: (err: Error, docs ?: any) => void): void {
        this.baseQuery(dataType , queryObject , callbackFn );
    }

    public AddToMasterData(dataType : string , newValue : string , callbackFn: (err: Error, docs ?: any) => void): void {
        let collection = this.mongodb.collection( dataType );
        this.baseQuery('FoodMasterData' , { 'values' : newValue } , (err, docs ) => {
            if (err)
                callbackFn(err);
            else{
                //if it exists - dont add again
                if( docs.length ){
                    callbackFn(null , docs[0] )
                } else{
                    collection.insertOne( { 'values' : newValue }, (err: Error, updatedDoc) => {
                        if (err)
                            callbackFn(err);
                        else {
                            callbackFn(null, updatedDoc);
                        }
                    })
                }
            }
        });
    }

    public fetchOrAddRestaurant( clientRestaurant : Restaurant , callbackFn: (err: Error, restrnt ?: MongoRestaurant ) => void): void {
        let query = { name : clientRestaurant.name , lat : clientRestaurant.lat , lng : clientRestaurant.lng };
        this.baseQuery('central.db' , query , (err , docs ) => {
            if(err){
                callbackFn(err);
            }else{
                if( docs[0] ){
                    return callbackFn( null , docs[0] as MongoRestaurant );
                } else{
                    //Add new restaurant
                    this.addRestaurant(clientRestaurant , (err , doc ) => {
                        if(err){
                            callbackFn(err);
                        }else{
                            callbackFn(null , doc as MongoRestaurant );
                        }
                    });
                }
            }
        });
    }
}