"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
class ByRestaurantQuery extends base_1.BaseQueryHandler {
    constructor() {
        super();
    }
    execute(params, callback) {
        let passValidation = this.validate(params);
        if (passValidation) {
            let restaurantId = params.restaurantId;
            this.getDataById(restaurantId, (err, doc) => {
                let ratings = doc ? doc.ratings : [];
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
        if (params.restaurantId)
            return true;
        return false;
    }
}
exports.ByRestaurantQuery = ByRestaurantQuery;
