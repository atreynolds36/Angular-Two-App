"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connect_1 = require("../Database_Connect/connect");
const API_Incoming_Payload_1 = require("../types/API_Incoming_Payload");
class ModifyRouter {
    static bootstrap() {
        return new ModifyRouter().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
        this.connector = connect_1.Connector.bootstrap();
    }
    configRoutes() {
        this.router.post('/restaurant/:id', this.updateRestaurantRoute.bind(this));
        this.router.post('/rating/:id', this.updateRating.bind(this));
    }
    updateRestaurantRoute(req, res) {
        let restaurantToModify = new API_Incoming_Payload_1.Restaurant(req.body);
        this.updateHandler(req, res, 'restaurants', restaurantToModify, req.params.id);
    }
    updateRating(req, res) {
        let ratingToModify = new API_Incoming_Payload_1.Rating(req.body);
        this.updateHandler(req, res, 'ratings', ratingToModify, req.params.id);
    }
    updateHandler(req, res, collection, document, id) {
        if (document.validate()) {
            this.connector.update(collection, id, document, (err, newDoc) => {
                if (err)
                    res.status(400).send({ error: err.message });
                else
                    res.status(201).send({ create: { data: newDoc } });
            });
        }
        else {
            res.status(416).send({ failedValidation: true });
        }
    }
}
exports.ModifyRouter = ModifyRouter;
class PostRequestValidator {
    static validatePayload(schema, payload) {
        let success = true;
        schema.forEach((str) => {
            if (payload[str] === undefined) {
                success = false;
                return false;
            }
        });
        return success;
    }
}
