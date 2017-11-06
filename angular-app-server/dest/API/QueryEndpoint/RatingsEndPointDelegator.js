"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByRestaurantQuery_1 = require("./RatingsEndPoint/ByRestaurantQuery");
const ByFood_1 = require("./RatingsEndPoint/ByFood");
const byRestaurantQueryHandler = new ByRestaurantQuery_1.ByRestaurantQuery();
const byFoodQueryHandler = new ByFood_1.ByFoodQueryHandler();
function default_1(filter) {
    switch (filter) {
        case 'restaurantId':
            return byRestaurantQueryHandler;
        case 'foodType':
            return byFoodQueryHandler;
        default:
            return null;
    }
}
exports.default = default_1;
