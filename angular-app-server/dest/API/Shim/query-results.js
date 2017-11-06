"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryResults {
    static transformIntoOutGoingResults(type, results) {
        return {
            queryInfo: {
                resultLength: results.length,
                hasMore: false,
                type: type
            },
            results: results,
        };
    }
}
exports.QueryResults = QueryResults;
