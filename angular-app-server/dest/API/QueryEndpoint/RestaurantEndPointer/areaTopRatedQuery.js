"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
const ReusableQueryFunctions_1 = require("./ReusableQueryFunctions");
class AreaTopRatedQuery extends base_1.BaseQueryHandler {
    constructor() {
        super();
    }
    execute(params, callback) {
        let passValidation = this.validate(params);
        if (passValidation) {
            let query = ReusableQueryFunctions_1.default.getCloseAreaQuery(params.lat, params.lng);
            this.getDataByQuery(query, (err, results) => {
                if (err)
                    callback(err);
                else {
                    let processedResults = ReusableQueryFunctions_1.default.processAndSortRestaurantsByScore(results);
                    callback(null, processedResults);
                }
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
}
exports.AreaTopRatedQuery = AreaTopRatedQuery;
