"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByRestaurantQuery_1 = require("./RatingsEndPoint/ByRestaurantQuery");
const ByFood_1 = require("./RatingsEndPoint/ByFood");
const ByUserId_1 = require("./RatingsEndPoint/ByUserId");
const ByCuisine_1 = require("./RatingsEndPoint/ByCuisine");
const byRestaurantQueryHandler = new ByRestaurantQuery_1.ByRestaurantQuery();
const byFoodQueryHandler = new ByFood_1.ByFoodQueryHandler();
const byUserID = new ByUserId_1.ByUserIdQuery();
const byCuisine = new ByCuisine_1.ByCuisineHandler();
function default_1(filter) {
    switch (filter) {
        case 'restaurantId':
            return byRestaurantQueryHandler;
        case 'foodType':
            return byFoodQueryHandler;
        case 'byUser':
            return byUserID;
        case 'byCuisine':
            return byCuisine;
        default:
            return null;
    }
}
exports.default = default_1;
