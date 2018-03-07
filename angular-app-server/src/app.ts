/// <reference path="_all.d.ts" />

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";

import { CreateRouter} from './API/POST/create';
import { QUERYRouter} from './API/query';
import { ModifyRouter } from './API/modify';
import { MasterDataRouter } from './API/master-data';
import { GoogleAPIConnector } from './API/google-api-connect';
/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();

        //configure application
        this.config();
        this.routes();
        this.errorHandler();
    }

    config() {
        this.app.use(bodyParser.json());
        this.app.use( (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,X-XSRF-TOKEN");
            next();
        });
    }

    private routes(){
        this.app.use('/create' , CreateRouter.bootstrap() );
        this.app.use('/query' , QUERYRouter.bootstrap() );
        this.app.use('/update' , ModifyRouter.bootstrap() );
        this.app.use('/masterdata' , MasterDataRouter.bootstrap() );
        this.app.use('/google-api' , GoogleAPIConnector.bootstrap() );
        //if doesnt match any route - return 404
        this.app.use((req, res, next) => {
            let err : APIError = <APIError>new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }

    private errorHandler(){
        this.app.use(function(err, req, res, next) {
            res.status(err.status || 500).send({
                message : err.message || 'Unknown',
                stack : err.stack || 'No Stack trace'
            });
        });
    }
}

interface APIError extends Error{
    status : number;
}