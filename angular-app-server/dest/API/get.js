"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connect_1 = require("../Database_Connect/connect");
class GetRouter {
    static bootstrap() {
        return new GetRouter().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
        this.connector = connect_1.Connector.bootstrap();
    }
    configRoutes() {
        this.router.get('/restaurant/:id', this.getRestaurantHandler.bind(this));
    }
    getRestaurantHandler(req, res) {
        let restaurantId = req.params.id;
        this.connector.getRestaurantById(restaurantId, (err, restaurant) => {
            if (err) {
                res.status(400).send({ error: err.message });
            }
            else {
                res.status(200).send(restaurant.getAPIOutgoingStructure());
            }
        });
    }
}
exports.GetRouter = GetRouter;
