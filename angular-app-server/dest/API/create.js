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
const express = require("express");
const connect_1 = require("../Database_Connect/connect");
const API_Incoming_Payload_1 = require("../types/API_Incoming_Payload");
const google_api_connect_1 = require("./google-api-connect");
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
        this.router.post('/rating', this.newAndImproveAddRatingRoute.bind(this));
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
    newAndImproveAddRatingRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let restaurant = yield google_api_connect_1.GoogleAPIConnector.getPlaceByPlaceId(req.body.google_place_id);
            this.connector.fetchRestaurantIdInDb(restaurant, (err, dbRestaurant) => {
                if (err) {
                    res.status(400).send();
                }
                else {
                    this.createRating(req.body, dbRestaurant, res);
                }
            });
        });
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
    createRating(rating, myRestaurant, res) {
        let ratingToAdd = new API_Incoming_Payload_1.Rating(rating);
        if (ratingToAdd.validate()) {
            this.connector.AddToMasterData('FoodMasterData', ratingToAdd.food_name, (err, doc) => {
                if (err)
                    console.error(err);
                else
                    console.log('Successful update for ' + ratingToAdd.food_name);
            });
            let ratingNode;
            console.log(myRestaurant.ratings.length);
            myRestaurant.ratings.forEach(function (node) {
                if (node.food.toUpperCase() == ratingToAdd.food_name.toUpperCase()) {
                    ratingNode = node;
                    return false;
                }
            });
            if (ratingNode) {
                console.log('Rating defined' + ratingNode.food);
                let total = ratingNode.count * ratingNode.score + ratingToAdd.grade;
                ratingNode.count++;
                let newScore = total / ratingNode.count;
                ratingNode.score = newScore;
                ratingNode.lastRated = ratingToAdd.date;
                this.connector.updateByQuery({ _id: myRestaurant._id, 'ratings.food': ratingNode.food }, { 'ratings.$': ratingNode }, (err, updatedDoc) => {
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
                this.connector.updateByQueryAddToArray({ _id: myRestaurant._id }, { 'ratings': ratingNode }, (err, updatedDoc) => {
                    if (err)
                        res.status(400).send({ error: true });
                    else {
                        console.log(updatedDoc);
                        res.status(201).send({ create: { data: updatedDoc } });
                    }
                });
            }
        }
        else {
            res.status(416).send({ failedValidation: true });
        }
    }
}
exports.CreateRouter = CreateRouter;
