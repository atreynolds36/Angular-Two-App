/**
 * Created by areynolds2 on 10/19/2017.
 */

import { CoordinateQueryHandler } from './RestaurantEndPointer/coordinateQuery';
import { AreaTopRatedQuery } from './RestaurantEndPointer/areaTopRatedQuery';
import { FoodTypeQuery } from './RestaurantEndPointer/foodTypeQuery';
import { BaseQueryHandler } from './base';

const coordinateQueryHandler= new CoordinateQueryHandler();
const areatopInAreaHandler = new AreaTopRatedQuery();
const foodTypeQuery = new FoodTypeQuery();

export default function ( filter ) : BaseQueryHandler {
    switch( filter ){
        case 'coordinates' :
            return coordinateQueryHandler;
        case 'topInArea' :
            return areatopInAreaHandler;
        case 'foodType' :
            return foodTypeQuery;
        default :
            return null;
    }
}