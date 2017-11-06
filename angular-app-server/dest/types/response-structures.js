"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryResponse {
    constructor(type, res) {
        this.__metadata = {
            result_length: res.length,
            type: type
        };
        this.results = res;
    }
}
exports.QueryResponse = QueryResponse;
