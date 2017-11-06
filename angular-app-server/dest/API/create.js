"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connect_1 = require("../Database_Connect/connect");
const API_Incoming_Payload_1 = require("../types/API_Incoming_Payload");
class CreateRouter {
    static bootstrap() {
        return new CreateRouter().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
        this.connector = connect_1.Connector.bootstrap();
    }
    configRoutes() {
        this.router.post('/restaurant', this.createRestaurantRoute.bind(this));
        this.router.post('/rating', this.createRating.bind(this));
        this.router.post('/masterdata/food-item', this.addMasterDataFood.bind(this));
    }
    addMasterDataFood(req, res) {
        let newValue = req.body.value;
        if (newValue) {
            newValue = newValue.toUpperCase();
            this.connector.AddToMasterData('FoodMasterData', newValue, (err, object) => {
                if (err)
                    res.status(400).send();
                else
                    res.status(201).send(object);
            });
        }
        else {
            res.status(400).send({ 'error': 'Missing value field in payload' });
        }
    }
    createRestaurantRoute(req, res) {
        let newInstance = new API_Incoming_Payload_1.Restaurant(req.body);
        if (newInstance.validate()) {
            this.connector.newAdd(newInstance, (err, newDoc) => {
                if (err)
                    res.status(400).send({ error: true });
                else
                    res.status(201).send({ create: { data: newDoc } });
            });
        }
        else {
            res.status(416).send({ failedValidation: true });
        }
    }
    createRating(req, res) {
        let ratingToAdd = new API_Incoming_Payload_1.Rating(req.body);
        if (ratingToAdd.validate()) {
            this.connector.AddToMasterData('FoodMasterData', ratingToAdd.food_name, (err, doc) => {
                if (err)
                    console.error(err);
                else
                    console.log('Successful update for ' + ratingToAdd.food_name);
            });
            this.connector.findToModify('central.db', ratingToAdd.restaurant_id, (err, doc) => {
                if (err)
                    res.status(400).send({ error: true });
                else {
                    let ratingNode;
                    console.log(doc.ratings.length);
                    doc.ratings.forEach(function (node) {
                        if (node.food.toUpperCase() == ratingToAdd.food_name.toUpperCase()) {
                            ratingNode = node;
                            return false;
                        }
                    });
                    console.log(doc);
                    if (ratingNode) {
                        console.log('Rating defined' + ratingNode.food);
                        let total = ratingNode.count * ratingNode.score + ratingToAdd.grade;
                        ratingNode.count++;
                        let newScore = total / ratingNode.count;
                        ratingNode.score = newScore;
                        ratingNode.lastRated = ratingToAdd.date;
                        this.connector.updateByQuery({ _id: doc._id, 'ratings.food': ratingNode.food }, { 'ratings.$': ratingNode }, (err, updatedDoc) => {
                            if (err)
                                res.status(400).send({ error: true });
                            else {
                                console.log(updatedDoc);
                                res.status(201).send({ create: { data: updatedDoc } });
                            }
                        });
                    }
                    else {
                        ratingNode = {
                            count: 1,
                            score: ratingToAdd.grade,
                            lastRated: ratingToAdd.date,
                            food: ratingToAdd.food_name.toUpperCase()
                        };
                        this.connector.updateByQueryAddToArray({ _id: doc._id }, { 'ratings': ratingNode }, (err, updatedDoc) => {
                            if (err)
                                res.status(400).send({ error: true });
                            else {
                                console.log(updatedDoc);
                                res.status(201).send({ create: { data: updatedDoc } });
                            }
                        });
                    }
                }
            });
        }
        else
            res.status(416).send({ failedValidation: true });
    }
    createOrModifyExistingRating(req, res, newInstance) {
        if (newInstance.validate()) {
            let queryForPreviousRating = { restaurant_id: newInstance.restaurant_id, food_name: newInstance.food_name };
            this.connector.query('ratings', queryForPreviousRating, (err, docs) => {
                if (docs.length) {
                    let _id = docs[0]._id;
                }
            });
        }
        else {
            res.status(416).send({ failedValidation: true });
        }
    }
}
exports.CreateRouter = CreateRouter;
