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
        this.connector.query('central.db', query, (err, results) => {
            if (err)
                callback(err);
            else
                callback(null, results);
        });
    }
}
exports.BaseQueryHandler = BaseQueryHandler;
