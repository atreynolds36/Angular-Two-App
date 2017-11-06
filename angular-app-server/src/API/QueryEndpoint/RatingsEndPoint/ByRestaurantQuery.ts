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

//import fns from './ReusableQueryFunctions';


export class ByRestaurantQuery extends BaseQueryHandler implements BaseQueryHandlerInterface {
    constructor() {
        super();
    }

    execute(params, callback: (err, data ?: any) => void): void {
        let passValidation = this.validate(params);
        if (passValidation) {
            let restaurantId : string = params.restaurantId;
            this.getDataById(restaurantId , (err, doc ) => {
                let ratings = doc ? doc.ratings : [] ;
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
        if (params.restaurantId )
            return true;
        return false;
    }
}