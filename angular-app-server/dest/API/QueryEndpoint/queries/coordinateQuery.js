"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
class CoordinateQueryHandler extends base_1.BaseQueryHandler {
    constructor() {
        super();
    }
    execute(params, callback) {
        let passValidation = this.validate(params);
        if (passValidation) {
            let query = this.buildQuery(params.lat, params.lng);
            this.getDataByQuery(query, (err, results) => {
                if (err)
                    callback(err);
                else
                    callback(null, results);
            });
        }
        else {
            callback({ validationFailed: 'true' });
        }
    }
    validate(params) {
        if (params.lat && params.lng)
            return true;
        return false;
    }
    buildQuery(latIn, lngIn) {
        let lat = parseFloat(latIn);
        let lng = parseFloat(lngIn);
        console.log(lat + .2);
        console.log(lng);
        return { lat: { $lt: lat + .2, $gt: lat - .2 }, lng: { $lt: lng + .2, $gt: lng - .2 } };
    }
}
exports.CoordinateQueryHandler = CoordinateQueryHandler;
