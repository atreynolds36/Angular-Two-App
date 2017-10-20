"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connect_1 = require("../Database_Connect/connect");
const base_1 = require("./QueryEndpoint/base");
const query_results_1 = require("./Shim/query-results");
const RestaurantEndPointDelegator_1 = require("./QueryEndpoint/RestaurantEndPointDelegator");
class QUERYRouter {
    static bootstrap() {
        return new QUERYRouter().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
        this.connector = connect_1.Connector.bootstrap();
        this.restaurantQueryHandler = new base_1.BaseQueryHandler();
    }
    configRoutes() {
        this.router.get('/ratings', this.getQueryRatings.bind(this));
        this.router.get('/restaurants', this.getQueryRestaurants.bind(this));
        this.router.get('/restaurants/test', this.getQueryRestaurantsAll.bind(this));
    }
    getQueryRatings(req, res) {
        let params = req.query;
        console.log(params.restaurantId);
        if (params.filter == 'byRestaurant' && params.restaurantId) {
            let restaurantId = params.restaurantId;
            this.connector.queryById(restaurantId, (err, doc) => {
                if (err)
                    res.status(400).send({ error: err });
                else {
                    let results = doc.ratings;
                    res.status(200).send(query_results_1.QueryResults.transformIntoOutGoingResults(results));
                }
            });
        }
        else
            res.status(400).send({ error: 'Invalid Query' });
    }
    getQueryRestaurantsAll(req, res) {
        this.connector.queryAll('central.db', ((err, results) => {
            if (err)
                res.status(404).send({ error: err.message });
            else {
                res.status(200).send(results);
            }
        }));
    }
    getQueryRestaurants(req, res) {
        let params = req.query;
        let handler = RestaurantEndPointDelegator_1.default(params.filter);
        if (handler) {
            handler.execute(params, (err, results) => {
                if (err)
                    res.status(404).send({ error: err.message });
                else
                    res.status(200).send(query_results_1.QueryResults.transformIntoOutGoingResults(results));
            });
        }
        else {
            this.queryAllRestaurants(req, res);
        }
    }
    queryAllRestaurants(req, res) {
        this.connector.queryAll('central.db', (err, docs) => {
            if (err)
                res.status(400).send({ error: true });
            else
                res.status(200).send(query_results_1.QueryResults.transformIntoOutGoingResults(docs));
        });
    }
    relativeAreaQuery(latInput, lngInput) {
        let lat = parseFloat(latInput);
        let lng = parseFloat(lngInput);
        console.log(lat + .2);
        console.log(lng);
        return { lat: { $lt: lat + .2, $gt: lat - .2 }, lng: { $lt: lng + .2, $gt: lng - .2 } };
    }
}
exports.QUERYRouter = QUERYRouter;
