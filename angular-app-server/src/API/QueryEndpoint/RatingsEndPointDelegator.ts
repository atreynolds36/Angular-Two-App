/**
 * Created by areynolds2 on 10/19/2017.
 */

import { ByRestaurantQuery } from './RatingsEndPoint/ByRestaurantQuery';
import { ByFoodQueryHandler } from './RatingsEndPoint/ByFood';
import { BaseQueryHandler } from './base';
import {ByUserIdQuery} from "./RatingsEndPoint/ByUserId";

const byRestaurantQueryHandler= new ByRestaurantQuery();
const byFoodQueryHandler = new ByFoodQueryHandler();
const byUserID = new ByUserIdQuery();

export default function ( filter ) : BaseQueryHandler {
    switch( filter ){
        case 'restaurantId' :
            return byRestaurantQueryHandler;
        case 'foodType' :
            return byFoodQueryHandler;
        case 'byUser' :
            return byUserID;
        default :
            return null;
    }
}