/**
 * Created by areynolds2 on 10/20/2017.
 */
/*
 Handles endpoint
 /query/ratings?filter=byCuisine&type=x&lat=x&lng=x
 */

import { BaseQueryHandler , BaseQueryHandlerInterface} from '../base';

import fns from '../RestaurantEndPointer/ReusableQueryFunctions';
import ratingsFns from './ReusableRatingsQueryFns';
import {RestaurantDO} from "../../../DataObjects/Restaurant";

export class ByCuisineHandler extends BaseQueryHandler implements BaseQueryHandlerInterface {
    constructor() {
        super();
    }

    execute(params, callback: (err, data ?: any) => void): void {
        let passValidation = this.validate(params);
        if (passValidation) {
            let queryBase : any = fns.getCloseAreaQuery(params.lat , params.lng );
            queryBase['cuisineTypesArray'] = params.type.toLowerCase();
            this.getDataByQuery(queryBase , (err, results : Array<RestaurantDO> ) => {
                let ratings : Array<PublicRating> = ratingsFns.combineRestaurantRatings( results );
                fns.quickSort(ratings , 'score' , 0 , ratings.length - 1 );
                if(err)
                    callback(err);
                else
                    callback(null , ratings );
            });

        } else {
            callback({validationFailed: 'true'});
        }
    }

    validate(params) {
        if (params.type && params.lat && params.lng )
            return true;
        return false;
    }
}