"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class MasterDataRouter {
    static bootstrap() {
        return new MasterDataRouter().router;
    }
    constructor() {
        this.router = express.Router();
        this.configRoutes();
    }
    configRoutes() {
        this.router.get('/cuisine-types', this.foodGenreRoute.bind(this));
        this.router.get('/:genres/types', this.foodTypeByGenre.bind(this));
    }
    foodGenreRoute(req, res) {
        res.json([
            "AMERICAN",
            "CHINESE",
            "ITALIAN",
            "MEXICAN",
            "SEAFOOD",
            "MEDITERRANEAN"
        ]);
    }
    foodTypeByGenre(req, res) {
    }
}
exports.MasterDataRouter = MasterDataRouter;
