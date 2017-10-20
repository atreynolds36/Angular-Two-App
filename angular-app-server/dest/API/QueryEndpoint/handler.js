"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coordinateQuery_1 = require("./queries/coordinateQuery");
const coordinateQueryHandler = new coordinateQuery_1.CoordinateQueryHandler();
function default_1(filter) {
    switch (filter) {
        case 'coordinates':
            return coordinateQueryHandler;
        default:
            return null;
    }
}
exports.default = default_1;
