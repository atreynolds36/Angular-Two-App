interface QueryJsonResponse{
    __metadata ?: Object,
    results : Array<Node>
}


export class QueryResponse implements  QueryJsonResponse {
    results : Array<Node>;
    __metadata : Object;
    constructor(res){
        this.__metadata = {
            result_length : res.length
        }
        this.results = res;
    }
}
