"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../../Database_Connect/connect");
class BaseQueryHandler {
    constructor() {
        this.connector = connect_1.Connector.bootstrap();
    }
    execute(params, callback) {
        callback({ codeFailure: 'Lack of execute function within query class' });
    }
    getDataByQuery(query, callback) {
        this.connector.centralQuery(query, (err, results) => {
            console.log('query res length ' + results && results.length);
            if (err)
                callback(err);
            else
                callback(null, results);
        });
    }
    getDataById(id, callback) {
        this.connector.queryById(id, (err, doc) => {
            console.log('fetch ' + doc);
            if (err)
                callback(err);
            else
                callback(null, doc);
        });
    }
}
exports.BaseQueryHandler = BaseQueryHandler;
