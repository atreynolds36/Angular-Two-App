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
            query.type = params.type;
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
        if (params.lat && params.lng && params.type)
            return true;
        return false;
    }
}