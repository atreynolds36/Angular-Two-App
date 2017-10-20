"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = require("mongodb");
const mongo_uri = 'mongodb://localhost:27017/angular';
const object_id = mongodb.ObjectID;
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
    newAdd(document, callbackFn) {
        let collection = this.mongodb.collection('central.db');
        collection.insertOne(document, (err, newDoc) => {
            if (err)
                callbackFn(err);
            else
                callbackFn(null, newDoc.ops[0]);
        });
    }
    newUpdate(documentId, document, callbackFn) {
        let collection = this.mongodb.collection('central.db');
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
    find(collectionName, id, callbackFn) {
        let collection = this.mongodb.collection(collectionName);
        let docId;
        try {
            docId = new object_id(id);
        }
        catch (err) {
            callbackFn(err);
        }
        let questionDoc = collection.findOne({ _id: docId }, { _id: 0 }, (err, doc) => {
            if (doc) {
                console.log(doc);
                callbackFn(null, doc);
            }
            else
                callbackFn(new Error('Could not find record'));
        });
    }
    findToModify(collectionName, id, callbackFn) {
        let collection = this.mongodb.collection(collectionName);
        let docId;
        try {
            docId = new object_id(id);
        }
        catch (err) {
            callbackFn(err);
        }
        let questionDoc = collection.findOne({ _id: docId }, (err, doc) => {
            if (doc) {
                console.log(doc);
                callbackFn(null, doc);
            }
            else
                callbackFn(new Error('Could not find record'));
        });
    }
    query(collectionName, queryObject, callbackFn) {
        this.baseQuery(collectionName, queryObject, callbackFn);
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
    queryById(id, callbackFn) {
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
                console.log(doc);
                callbackFn(null, doc);
            }
            else
                callbackFn(new Error('Could not find record'));
        });
    }
    groupByFields(collectionStr, groupByClause, callbackFn) {
        let collection = this.mongodb.collection(collectionStr);
        collection.aggregate([groupByClause], (err, docs) => {
            if (err)
                callbackFn(err);
            else {
                callbackFn(null, docs);
            }
        });
    }
}
exports.Connector = Connector;
