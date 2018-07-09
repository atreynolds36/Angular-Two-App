"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const Restaurant_1 = require("../DataObjects/Restaurant");
const yelp_api_connect_1 = require("../API/yelp-api-connect");
const mongo_uri = 'mongodb://localhost:27017/angular';
const object_id = mongodb.ObjectID;
const RestaurantMongoCollectionName = 'central.db';
class Connector {
    static bootstrap() {
        return new Connector();
    }
    constructor() {
        this.client = mongodb.MongoClient;
        this.connect();
    }
    connect() {
        this.client.connect(mongo_uri, (err, db) => {
            if (err)
                console.error(err);
            else
                this.mongodb = db;
        });
    }
    addRestaurant(document, callbackFn) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = this.mongodb.collection(RestaurantMongoCollectionName);
            let types = yield yelp_api_connect_1.YelpApiConnector.getRestaurantCusinesTypesByLatAndLngAndName(document.name, document.lat, document.lng).catch((rej) => {
                throw new Error(rej);
            });
            document.cuisineTypesArray = types;
            collection.insertOne(document, (err, newDoc) => {
                if (err)
                    callbackFn(err);
                else
                    callbackFn(null, newDoc.ops[0]);
            });
        });
    }
    update(collectionName, documentId, document, callbackFn) {
        let collection = this.mongodb.collection(collectionName);
        let docId;
        try {
            docId = new object_id(documentId);
        }
        catch (err) {
            callbackFn(err);
        }
        collection.findOneAndUpdate({ _id: docId }, { $set: document }, (err, updatedDoc) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, updatedDoc);
            }
        });
    }
    updateByQuery(queryFilter, document, callbackFn) {
        let collection = this.mongodb.collection('central.db');
        collection.findOneAndUpdate(queryFilter, { $set: document }, (err, updatedDoc) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, updatedDoc);
            }
        });
    }
    updateByQueryAddToArray(queryFilter, document, callbackFn) {
        let collection = this.mongodb.collection('central.db');
        collection.findOneAndUpdate(queryFilter, { $push: document }, (err, updatedDoc) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, updatedDoc);
            }
        });
    }
    queryAll(collectionName, callbackFn) {
        let collection = this.mongodb.collection(collectionName);
        collection.find().toArray((err, docs) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, docs);
            }
        });
    }
    centralQuery(queryObject, callbackFn) {
        this.baseQuery('central.db', queryObject, (err, docs) => {
            if (err)
                callbackFn(err);
            else {
                let dataResults = Array();
                for (let d of docs) {
                    dataResults.push(new Restaurant_1.RestaurantDO(d));
                }
                callbackFn(null, dataResults);
            }
        });
    }
    baseQuery(collectionName, queryObject, callbackFn) {
        let collection = this.mongodb.collection(collectionName);
        let questionDoc = collection.find(queryObject);
        questionDoc.toArray((err, docs) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, docs);
            }
        });
    }
    getRestaurantById(id, callbackFn) {
        let collection = this.mongodb.collection('central.db');
        let docId;
        try {
            docId = new object_id(id);
        }
        catch (err) {
            callbackFn(err);
        }
        let questionDoc = collection.findOne({ _id: docId }, (err, doc) => {
            if (doc) {
                let restaurant = new Restaurant_1.RestaurantDO(doc);
                callbackFn(null, restaurant);
            }
            else
                callbackFn(new Error('Could not find record'));
        });
    }
    filterMasterdata(dataType, queryObject, callbackFn) {
        this.baseQuery(dataType, queryObject, callbackFn);
    }
    AddToMasterData(dataType, newValue, callbackFn) {
        let collection = this.mongodb.collection(dataType);
        this.baseQuery('FoodMasterData', { 'values': newValue }, (err, docs) => {
            if (err)
                callbackFn(err);
            else {
                if (docs.length) {
                    callbackFn(null, docs[0]);
                }
                else {
                    collection.insertOne({ 'values': newValue }, (err, updatedDoc) => {
                        if (err)
                            callbackFn(err);
                        else {
                            callbackFn(null, updatedDoc);
                        }
                    });
                }
            }
        });
    }
    fetchOrAddRestaurant(clientRestaurant, callbackFn) {
        let query = { name: clientRestaurant.name, lat: clientRestaurant.lat, lng: clientRestaurant.lng };
        this.baseQuery('central.db', query, (err, docs) => {
            if (err) {
                callbackFn(err);
            }
            else {
                if (docs[0]) {
                    return callbackFn(null, docs[0]);
                }
                else {
                    this.addRestaurant(clientRestaurant, (err, doc) => {
                        if (err) {
                            callbackFn(err);
                        }
                        else {
                            callbackFn(null, doc);
                        }
                    });
                }
            }
        });
    }
}
exports.Connector = Connector;
