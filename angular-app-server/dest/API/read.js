"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const connect_1 = require("../Database_Connect/connect");
class GETRouter {
    static bootstrap() {
        return new GETRouter().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
        this.connector = connect_1.Connector.bootstrap();
    }
    configRoutes() {
        this.router.get('/restaurants', this.getAllRestaurantRoute.bind(this));
        this.router.get('/restaurant/:id', this.getRestaurantById.bind(this));
        this.router.get('/ratings', this.getAllRating.bind(this));
        this.router.get('/rating/:id', this.getRatingById.bind(this));
        this.router.get('/meals', this.getAllMeal.bind(this));
        this.router.get('/meals/:id', this.getMealById.bind(this));
    }
    getAllRestaurantRoute(req, res) {
        this.queryAllHandlers(req, res, 'restaurants');
    }
    getAllRating(req, res) {
        this.queryAllHandlers(req, res, 'ratings');
    }
    getAllMeal(req, res) {
        this.queryAllHandlers(req, res, 'meals');
    }
    getRestaurantById(req, res) {
        let id = req.params.id;
        this.findRecordById(req, res, 'restaurants', id);
    }
    getRatingById(req, res) {
        let id = req.params.id;
        this.findRecordById(req, res, 'ratings', id);
    }
    getMealById(req, res) {
        let id = req.params.id;
        this.findRecordById(req, res, 'meals', id);
    }
    queryAllHandlers(req, res, collection) {
        this.connector.queryAll(collection, (err, docs) => {
            if (err)
                res.status(400).send({ error: true });
            else
                res.status(200).send({ results: docs });
        });
    }
    findRecordById(req, res, collection, id) {
        this.connector.find(collection, id, (err, doc) => {
            if (err)
                res.status(404).send({ error: err.message });
            else
                res.status(200).send({ data: doc });
        });
    }
}
exports.GETRouter = GETRouter;
