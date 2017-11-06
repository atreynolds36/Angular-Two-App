interface QueryJsonResponse{
    __metadata ?: Object,
    results : Array<Node>
}



// NOT USED I DONT THINK
export class QueryResponse implements  QueryJsonResponse {
    results : Array<Node>;
    __metadata : Object;
    constructor(type : string , res : Array<any>){
        this.__metadata = {
            result_length : res.length,
            type : type
        };
        this.results = res;
    }
}
