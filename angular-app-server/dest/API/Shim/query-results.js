"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryResults {
    static transformIntoOutGoingResults(results) {
        return {
            queryInfo: {
                resultLength: results.length,
                hasMore: false
            },
            results: results,
        };
    }
}
exports.QueryResults = QueryResults;
