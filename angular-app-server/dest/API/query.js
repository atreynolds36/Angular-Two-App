"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connect_1 = require("../Database_Connect/connect");
const base_1 = require("./QueryEndpoint/base");
const query_results_1 = require("./Shim/query-results");
const RestaurantEndPointDelegator_1 = require("./QueryEndpoint/RestaurantEndPointDelegator");
const RatingsEndPointDelegator_1 = require("./QueryEndpoint/RatingsEndPointDelegator");
class QUERYRouter {
    static bootstrap() {
        return new QUERYRouter().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
        this.connector = connect_1.Connector.bootstrap();
        this.restaurantQueryHandler = new base_1.BaseQueryHandler();
        this.ratingsQueryHandler = new base_1.BaseQueryHandler();
    }
    configRoutes() {
        this.router.get('/ratings', this.getQueryRatings.bind(this));
        this.router.get('/restaurants', this.getQueryRestaurants.bind(this));
        this.router.get('/restaurants/test', this.getQueryRestaurantsAll.bind(this));
    }
    getQueryRatings(req, res) {
        let params = req.query;
        let handler = RatingsEndPointDelegator_1.default(params.filter);
        if (handler) {
            handler.execute(params, (err, results) => {
                if (err)
                    res.status(404).send({ error: err.message });
                else
                    res.status(200).send(query_results_1.QueryResults.transformIntoOutGoingResults('Ratings', results));
            });
        }
        else {
            res.status(400).send({ error: 'Invalid Query' });
        }
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
                    res.status(200).send(query_results_1.QueryResults.transformIntoOutGoingResults('Restaurants', results));
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
                res.status(200).send(query_results_1.QueryResults.transformIntoOutGoingResults('Restaurants', docs));
        });
    }
}
exports.QUERYRouter = QUERYRouter;
