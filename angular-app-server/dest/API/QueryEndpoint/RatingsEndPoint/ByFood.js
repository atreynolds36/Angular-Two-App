"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
const ReusableQueryFunctions_1 = require("../RestaurantEndPointer/ReusableQueryFunctions");
class ByFoodQueryHandler extends base_1.BaseQueryHandler {
    constructor() {
        super();
    }
    execute(params, callback) {
        let passValidation = this.validate(params);
        if (passValidation) {
            let queryBase = ReusableQueryFunctions_1.default.getCloseAreaQuery(params.lat, params.lng);
            queryBase['ratings.food'] = params.food.toUpperCase();
            this.getDataByQuery(queryBase, (err, results) => {
                let ratings = ReusableQueryFunctions_1.default.filterRatingsByFoodName(results, params.food);
                ReusableQueryFunctions_1.default.quickSort(ratings, 'score', 0, ratings.length - 1);
                if (err)
                    callback(err);
                else
                    callback(null, ratings);
            });
        }
        else {
            callback({ validationFailed: 'true' });
        }
    }
    validate(params) {
        if (params.food && params.lat && params.lng)
            return true;
        return false;
    }
}
exports.ByFoodQueryHandler = ByFoodQueryHandler;
