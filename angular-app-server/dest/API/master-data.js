"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connect_1 = require("../Database_Connect/connect");
const cuisineMongoCollectionName = 'Cuisine';
const foodNamesMongoCollectionName = 'FoodMasterData';
class MasterDataRouter {
    static bootstrap() {
        return new MasterDataRouter().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
        this.connector = connect_1.Connector.bootstrap();
    }
    configRoutes() {
        this.router.get('/cuisine-types', this.foodGenreRoute.bind(this));
        this.router.get('/food-types', this.foodTypes.bind(this));
    }
    foodGenreRoute(req, res) {
        let filter = req.query.filter && req.query.filter.toLowerCase();
        let expr = new RegExp(filter);
        let filterQuery = { 'value': expr };
        this.connector.filterMasterdata(cuisineMongoCollectionName, filterQuery, (err, values) => {
            if (err)
                res.status(400).send({ Error: 'In Masterdata' });
            else
                res.status(200).send(values);
        });
    }
    foodTypes(req, res) {
        let filter = req.query.filter && req.query.filter.toUpperCase();
        let expr = new RegExp(filter);
        let filterQuery = { 'values': expr };
        this.connector.filterMasterdata(foodNamesMongoCollectionName, filterQuery, (err, values) => {
            if (err)
                res.status(400).send({ Error: 'In Masterdata' });
            else
                res.status(200).send(values);
        });
    }
}
exports.MasterDataRouter = MasterDataRouter;
