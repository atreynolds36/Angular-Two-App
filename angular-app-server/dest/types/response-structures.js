"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryResponse {
    constructor(res) {
        this.__metadata = {
            result_length: res.length
        };
        this.results = res;
    }
}
exports.QueryResponse = QueryResponse;
