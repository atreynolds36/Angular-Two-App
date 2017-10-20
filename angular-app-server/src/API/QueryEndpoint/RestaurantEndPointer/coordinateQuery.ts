/**
 * Created by areynolds2 on 10/19/2017.
 */

/*
    Handles endpoint
        /query/restaurant?filter=coordinates&lat=x&lng=x
 */

import { BaseQueryHandler , BaseQueryHandlerInterface} from '../base';

import fns from './ReusableQueryFunctions';


export class CoordinateQueryHandler extends BaseQueryHandler implements BaseQueryHandlerInterface {
    constructor() {
        super();
    }

    execute(params, callback: (err, data ?: any) => void): void {
        let passValidation = this.validate(params);
        if (passValidation) {
            //let query = this.buildQuery(params.lat, params.lng);
            let query = fns.getCloseAreaQuery(params.lat, params.lng );
            this.getDataByQuery(query , (err, results ) => {
                if(err)
                    callback(err);
                else
                    callback(null,results);
            });

        } else {
            callback({validationFailed: 'true'});
        }
    }

    validate(params) {
        if (params.lat && params.lng)
            return true;
        return false;
    }
}