"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
const ReusableRatingsQueryFns_1 = require("./ReusableRatingsQueryFns");
class ByUserIdQuery extends base_1.BaseQueryHandler {
    constructor() {
        super();
    }
    execute(params, callback) {
        let passValidation = this.validate(params);
        console.log('Hit userid endpoint');
        if (passValidation) {
            console.log(params.userId);
            let queryObject = { 'ratings.userId': parseInt(params.userId) };
            this.getDataByQuery(queryObject, (err, docs) => {
                console.log(docs.length);
                let ratingList = this.transformList(docs, params.userId);
                if (err)
                    callback(err);
                else
                    callback(null, ratingList);
            });
        }
        else {
            callback({ validationFailed: 'true' });
        }
    }
    transformList(restaurantList, id) {
        let compileList = Array();
        for (let res of restaurantList) {
            let ratings = res.dbRecord.ratings;
            for (let rate of ratings) {
                if (rate.userId == id) {
                    let pubRating = ReusableRatingsQueryFns_1.default.wrapRatingToPublicRating(rate, res);
                    compileList.push(pubRating);
                }
            }
        }
        return compileList;
    }
    validate(params) {
        try {
            if (params.userId && parseInt(params.userId)) {
                return true;
            }
        }
        finally { }
        return false;
    }
}
exports.ByUserIdQuery = ByUserIdQuery;
