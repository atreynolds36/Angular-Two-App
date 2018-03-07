/**
 * Created by areynolds2 on 10/19/2017.
 */

/*
 Handles endpoint
 /query/restaurant?filter=coordinates&lat=x&lng=x
 */

import { BaseQueryHandler , BaseQueryHandlerInterface} from '../base';
import {RestaurantDO} from "../../../DataObjects/Restaurant";
import fns from './ReusableRatingsQueryFns';
export class ByUserIdQuery extends BaseQueryHandler implements BaseQueryHandlerInterface {
    constructor() {
        super();
    }

    execute(params, callback: (err, data ?: any) => void): void {
        let passValidation = this.validate(params);
        console.log('Hit userid endpoint');
        if (passValidation) {
            console.log( params.userId );
            let queryObject : any = { 'ratings.userId' : parseInt( params.userId ) } ;
            this.getDataByQuery(queryObject , (err, docs : Array<RestaurantDO> ) => {
                console.log( docs.length );
                let ratingList : Array<PublicRating> = this.transformList( docs , params.userId );
                if(err)
                    callback(err);
                else
                    callback(null , ratingList );
            });

        } else {
            callback({validationFailed: 'true'});
        }
    }

    private transformList( restaurantList : Array<RestaurantDO> , id : number ) : Array<PublicRating>{
        let compileList = Array<PublicRating>();

        for(let res of restaurantList ){
            let ratings = res.dbRecord.ratings;
            for(let rate of ratings ){
                if( rate.userId == id ){
                    let pubRating = fns.wrapRatingToPublicRating(rate, res );
                    compileList.push(pubRating);
                }
            }
        }
        return compileList;
    }

    validate(params) {
        try{
            if( params.userId && parseInt(params.userId ) ){
                return true;
            }
        }
        finally{}
        return false;
    }
}