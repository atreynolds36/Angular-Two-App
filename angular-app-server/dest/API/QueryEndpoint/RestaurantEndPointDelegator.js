"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coordinateQuery_1 = require("./RestaurantEndPointer/coordinateQuery");
const areaTopRatedQuery_1 = require("./RestaurantEndPointer/areaTopRatedQuery");
const foodTypeQuery_1 = require("./RestaurantEndPointer/foodTypeQuery");
const coordinateQueryHandler = new coordinateQuery_1.CoordinateQueryHandler();
const areatopInAreaHandler = new areaTopRatedQuery_1.AreaTopRatedQuery();
const foodTypeQuery = new foodTypeQuery_1.FoodTypeQuery();
function default_1(filter) {
    switch (filter) {
        case 'coordinates':
            return coordinateQueryHandler;
        case 'topInArea':
            return areatopInAreaHandler;
        case 'foodType':
            return foodTypeQuery;
        default:
            return null;
    }
}
exports.default = default_1;
