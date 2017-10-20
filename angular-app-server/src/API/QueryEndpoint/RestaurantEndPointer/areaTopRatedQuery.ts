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


export class AreaTopRatedQuery extends BaseQueryHandler implements BaseQueryHandlerInterface {
    constructor() {
        super();
    }

    execute(params, callback: (err, data ?: any) => void): void {
        let passValidation = this.validate(params);
        if (passValidation) {
            let query = fns.getCloseAreaQuery(params.lat, params.lng );
            this.getDataByQuery(query , (err, results ) => {
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

    //processAndSort(results : Array<DbRestaurant>) : Array<DbRestaurant>{
    processAndSort( results : Array<any> ) : Array<any>{
        let tempCount , tempScore;
        for (let node of results){
            tempCount = 0; tempScore = 0;
            for(let rating of node.ratings){
                tempCount += rating.count;
                tempScore += (rating.score * rating.count);
            }
            node.totalCount = tempCount;
            node.scoreAverage = tempScore / tempCount;
            if(node.ratings)
                fns.quickSort(node.ratings , 'score' , 0 , node.ratings.length - 1 );
        }
        return fns.quickSort(results, 'scoreAverage' , 0 , results.length - 1 );
    }



    validate(params) {
        if (params.lat && params.lng)
            return true;
        return false;
    }
}