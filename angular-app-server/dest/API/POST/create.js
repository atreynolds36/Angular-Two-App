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
const connect_1 = require("../../Database_Connect/connect");
const API_Incoming_Payload_1 = require("../../types/API_Incoming_Payload");
const google_api_connect_1 = require("../google-api-connect");
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
            this.connector.fetchOrAddRestaurant(restaurant, (err, dbRestaurant) => {
                if (err) {
                    res.status(400).send();
                }
                else {
                    let newRating = new API_Incoming_Payload_1.Rating(req.body);
                    if (newRating.validate()) {
                        this.addRating(newRating, dbRestaurant, res);
                    }
                    else
                        res.status(416).send({ failedValidation: true });
                }
            });
        });
    }
    addRating(rating, myRestaurant, res) {
        this.addFoodTypeToMasterData(rating.food_name);
        this.connector.updateByQueryAddToArray({ _id: myRestaurant._id }, { 'ratings': rating.get() }, (err, updatedDoc) => {
            if (err)
                res.status(400).send({ error: true });
            else {
                console.log(updatedDoc);
                res.status(201).send({ create: { data: updatedDoc } });
            }
        });
    }
    addFoodTypeToMasterData(foodType) {
        this.connector.AddToMasterData('FoodMasterData', foodType, (err, doc) => {
            if (err)
                console.error(err);
            else
                console.log('Successful update for ' + foodType);
        });
    }
}
exports.CreateRouter = CreateRouter;
