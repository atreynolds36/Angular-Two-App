/**
 * Created by areynolds2 on 10/20/2017.
 */
/**
 * Created by areynolds2 on 10/19/2017.
 */

/*
 Handles endpoint
 /query/restaurant?filter=coordinates&lat=x&lng=x
 */

import { BaseQueryHandler , BaseQueryHandlerInterface} from '../base';

import fns from './ReusableQueryFunctions';
import {RestaurantDO} from "../../../DataObjects/Restaurant";


export class AreaTopRatedQuery extends BaseQueryHandler implements BaseQueryHandlerInterface {
    constructor() {
        super();
    }

    execute(params, callback: (err, data ?: any) => void): void {
        let passValidation = this.validate(params);
        if (passValidation) {
            let query = fns.getCloseAreaQuery(params.lat, params.lng );
            this.getDataByQuery(query , (err, results : Array<RestaurantDO> ) => {
                if(err)
                    callback(err);
                else{
                    let processedResults = this.processAndSort(results);
                    callback(null, processedResults);
                }
            });

        } else {
            callback({validationFailed: 'true'});
        }
    }

    processAndSort( results : Array<RestaurantDO> ) : Array<RestaurantDO>{
        let readyToOutResults : Array<PublicRestaurant> = results.map( ( restaurant ) => {
            return restaurant.getAPIOutgoingStructure();
        })
        for (let res of readyToOutResults ){
            if( res.ratings)
                fns.quickSort(res.ratings , 'score' , 0 , res.ratings.length - 1 );
        }
        return fns.quickSort( readyToOutResults , 'averageScore' , 0 , results.length - 1 );
    }



    validate(params) {
        if (params.lat && params.lng)
            return true;
        return false;
    }
}