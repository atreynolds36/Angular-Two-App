/**
 * Created by areynolds2 on 10/19/2017.
 */

import { CoordinateQueryHandler } from './RestaurantEndPointer/coordinateQuery';
import { AreaTopRatedQuery } from './RestaurantEndPointer/areaTopRatedQuery';
import { BaseQueryHandler } from './base';

const coordinateQueryHandler= new CoordinateQueryHandler();
const areatopInAreaHandler = new AreaTopRatedQuery();

export default function ( filter ) : BaseQueryHandler {
    switch( filter ){
        case 'coordinates' :
            return coordinateQueryHandler;
        case 'topInArea' :
            return areatopInAreaHandler;
        default :
            return null;
    }
}