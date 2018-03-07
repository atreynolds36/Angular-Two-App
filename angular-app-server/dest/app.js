"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const create_1 = require("./API/POST/create");
const query_1 = require("./API/query");
const modify_1 = require("./API/modify");
const master_data_1 = require("./API/master-data");
const google_api_connect_1 = require("./API/google-api-connect");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errorHandler();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-XSRF-TOKEN");
            next();
        });
    }
    routes() {
        this.app.use('/create', create_1.CreateRouter.bootstrap());
        this.app.use('/query', query_1.QUERYRouter.bootstrap());
        this.app.use('/update', modify_1.ModifyRouter.bootstrap());
        this.app.use('/masterdata', master_data_1.MasterDataRouter.bootstrap());
        this.app.use('/google-api', google_api_connect_1.GoogleAPIConnector.bootstrap());
        this.app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }
    errorHandler() {
        this.app.use(function (err, req, res, next) {
            res.status(err.status || 500).send({
                message: err.message || 'Unknown',
                stack: err.stack || 'No Stack trace'
            });
        });
    }
}
exports.Server = Server;
