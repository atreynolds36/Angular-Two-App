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
                    let processedResults = this.processAndSort(results);
                    callback(null, processedResults);
                }
            });
        }
        else {
            callback({ validationFailed: 'true' });
        }
    }
    processAndSort(results) {
        let tempCount, tempScore;
        for (let node of results) {
            tempCount = 0;
            tempScore = 0;
            for (let rating of node.ratings) {
                tempCount += rating.count;
                tempScore += (rating.score * rating.count);
            }
            node.totalCount = tempCount;
            node.scoreAverage = tempScore / tempCount;
            if (node.ratings)
                ReusableQueryFunctions_1.default.quickSort(node.ratings, 'score', 0, node.ratings.length - 1);
        }
        return ReusableQueryFunctions_1.default.quickSort(results, 'scoreAverage', 0, results.length - 1);
    }
    validate(params) {
        if (params.lat && params.lng)
            return true;
        return false;
    }
}
exports.AreaTopRatedQuery = AreaTopRatedQuery;
