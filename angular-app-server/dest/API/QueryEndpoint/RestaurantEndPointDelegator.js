"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coordinateQuery_1 = require("./RestaurantEndPointer/coordinateQuery");
const areaTopRatedQuery_1 = require("./RestaurantEndPointer/areaTopRatedQuery");
const coordinateQueryHandler = new coordinateQuery_1.CoordinateQueryHandler();
const areatopInAreaHandler = new areaTopRatedQuery_1.AreaTopRatedQuery();
function default_1(filter) {
    switch (filter) {
        case 'coordinates':
            return coordinateQueryHandler;
        case 'topInArea':
            return areatopInAreaHandler;
        default:
            return null;
    }
}
exports.default = default_1;
