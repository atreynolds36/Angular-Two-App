import * as mongodb from 'mongodb';
import { MongoClient , Db , Collection , Cursor } from 'mongodb';

import { Restaurant , Rating } from '../types/API_Incoming_Payload';

const mongo_uri = 'mongodb://localhost:27017/angular';
const object_id = mongodb.ObjectID;

export class Connector{
    client : MongoClient;
    mongodb : Db;
    static bootstrap() : Connector {
        return new Connector();
    }
    constructor(){
        this.client = mongodb.MongoClient;
        this.connect();
    }
    connect(){
        this.client.connect( mongo_uri , (err, db : Db ) => {
            if(err)
                console.error(err);
            else
                this.mongodb = db;
        })
    }

    //CONSOLIDATE DB

    public newAdd(document : any , callbackFn : (err : Error, newDoc ?: any ) => void ) : void {
        let collection = this.mongodb.collection('central.db');
        collection.insertOne(document , (err : Error , newDoc ) => {
            if(err)
                callbackFn( err );
            else
                callbackFn( null , newDoc.ops[0] );
        })
    }

    public newUpdate( documentId : string , document : any , callbackFn : (err : Error , newDoc ?: any ) => void ) : void {
        let collection = this.mongodb.collection('central.db');
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
        Update Existing Record by ID
     */
    public update( collectionName : string , documentId : string , document : any , callbackFn : (err : Error , newDoc ?: any ) => void ) : void {
        let collection = this.mongodb.collection( collectionName ) ;
        let docId;
        try{
            docId = new object_id(documentId);
        } catch(err){
            callbackFn(err);
        }
        collection.findOneAndUpdate({ _id : docId } , { $set : document } , (err : Error , updatedDoc ) => {
            if(err)
                callbackFn( err );
            else{
                callbackFn( null , updatedDoc );
            }
        })
    }
    /*
        Update Based on Query
     */
    public updateByQuery( queryFilter : any , document : any , callbackFn : (err : Error , newDoc ?: any ) => void ) : void {
        let collection = this.mongodb.collection( 'central.db' ) ;
        collection.findOneAndUpdate( queryFilter , { $set : document } , (err : Error , updatedDoc ) => {
            if(err)
                callbackFn( err );
            else{
                callbackFn( null , updatedDoc );
            }
        })
    }
    /*
     Update Based on Query
     */
    public updateByQueryAddToArray( queryFilter : any , document : any , callbackFn : (err : Error , newDoc ?: any ) => void ) : void {
        let collection = this.mongodb.collection( 'central.db' ) ;
        collection.findOneAndUpdate( queryFilter , { $push : document } , (err : Error , updatedDoc ) => {
            if(err)
                callbackFn( err );
            else{
                callbackFn( null , updatedDoc );
            }
        })
    }
    /*
        TEST
     */
    public queryAll( collectionName : string , callbackFn : (err : Error , docs ?: Array<any> ) => void ) : void {
        let collection : Collection = this.mongodb.collection( collectionName ) ;

        collection.find().toArray( (err, docs ) => {
            if(err)
                callbackFn(err);
            else{
                callbackFn(null , docs );
            }
        });
    }
    /*
        Find one record in one collection
     */
    public find( collectionName : string , id : string , callbackFn : (err : Error , docs ?: Object ) => void ) : void {
        let collection = this.mongodb.collection( collectionName ) ;
        let docId;
        try{
            docId = new object_id(id);
        } catch(err){
            callbackFn(err);
        }
        let questionDoc = collection.findOne({ _id : docId } , { _id : 0 } , (err , doc) => {
            if(doc){
                console.log(doc);
                callbackFn(null,doc)
            } else
                callbackFn(new Error('Could not find record'));
        });
    }
    /*
     Find one record in one collection
     */
    public findToModify( collectionName : string , id : string , callbackFn : (err : Error , docs ?: Object ) => void ) : void {
        let collection = this.mongodb.collection( collectionName ) ;
        let docId;
        try{
            docId = new object_id(id);
        } catch(err){
            callbackFn(err);
        }
        let questionDoc = collection.findOne({ _id : docId } , (err , doc) => {
            if(doc){
                console.log(doc);
                callbackFn(null,doc)
            } else
                callbackFn(new Error('Could not find record'));
        });
    }
    /*
        Query a collection by queryObject
     */
    public query(collectionName : string , queryObject : Object , callbackFn : (err : Error , docs ?: Array<any> ) => void ) : void {
        this.baseQuery(collectionName, queryObject , callbackFn );
    }

    private baseQuery(collectionName : string  , queryObject : Object , callbackFn : (err : Error , docs ?: Array<any> ) => void ) : void {
        let collection = this.mongodb.collection( collectionName ) ;
        let questionDoc = collection.find(queryObject);

        questionDoc.toArray((err, docs ) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, docs);
            }
        })
    }

    public queryById( id : string , callbackFn : (err : Error , docs ?: any ) => void ) : void {
        let collection = this.mongodb.collection( 'central.db' ) ;
        let docId;
        try{
            docId = new object_id(id);
        } catch(err){
            callbackFn(err);
        }
        let questionDoc = collection.findOne({ _id : docId } , (err , doc) => {
            if(doc){
                console.log(doc);
                callbackFn(null,doc)
            } else
                callbackFn(new Error('Could not find record'));
        });
    }

    public groupByFields(collectionStr : string , groupByClause : Object , callbackFn : (err : Error , docs ?: Object ) => void) : void {
        let collection = this.mongodb.collection(collectionStr);
        collection.aggregate([groupByClause] , (err, docs ) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, docs);
            }
        })
    }
}