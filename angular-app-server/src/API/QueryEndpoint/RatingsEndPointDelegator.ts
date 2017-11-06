/**
 * Created by areynolds2 on 10/20/2017.
 */
/**
 * Created by areynolds2 on 10/19/2017.
 */

import { ByRestaurantQuery } from './RatingsEndPoint/ByRestaurantQuery';
import { ByFoodQueryHandler } from './RatingsEndPoint/ByFood';
import { BaseQueryHandler } from './base';

const byRestaurantQueryHandler= new ByRestaurantQuery();
const byFoodQueryHandler = new ByFoodQueryHandler();

export default function ( filter ) : BaseQueryHandler {
    switch( filter ){
        case 'restaurantId' :
            return byRestaurantQueryHandler;
        case 'foodType' :
            return byFoodQueryHandler;
        default :
            return null;
    }
}