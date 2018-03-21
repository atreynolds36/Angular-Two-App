/*
 Handles endpoint
 /query/restaurant?filter=foodType&type={type}&lat=x&lng=x
 */

import { BaseQueryHandler , BaseQueryHandlerInterface} from '../base';

import fns from './ReusableQueryFunctions';


export class FoodTypeQuery extends BaseQueryHandler implements BaseQueryHandlerInterface {
    constructor() {
        super();
    }

    execute(params, callback: (err, data ?: any) => void): void {
        let passValidation = this.validate(params);
        if (passValidation) {
            let query : any = fns.getCloseAreaQuery(params.lat, params.lng );
            query.cuisineTypesArray = params.type;
            this.getDataByQuery(query , (err, results ) => {
                if(err)
                    callback(err);
                else{
                    let processedResults = fns.processAndSortRestaurantsByScore(results);
                    callback(null, processedResults);
                }
            });

        } else {
            callback({validationFailed: 'true'});
        }
    }

    validate(params) {
        if (params.lat && params.lng && params.type)
            return true;
        return false;
    }
}