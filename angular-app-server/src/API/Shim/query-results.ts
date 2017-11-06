/**
 * Created by areynolds2 on 10/13/2017.
 */

export class QueryResults {
    static transformIntoOutGoingResults(type : string , results : Array<any>) : Object{
        return {
            queryInfo : {
                resultLength : results.length,
                hasMore : false, // temporary
                type : type
            },
            results : results,
        }
    }
}