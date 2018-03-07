/**
 * Created by areynolds2 on 10/19/2017.
 */

export interface BaseQueryHandlerInterface {
    execute: Function
    validate: Function
}

import { Connector } from '../../Database_Connect/connect';


export class BaseQueryHandler{
    connector : Connector;

    constructor(){
        this.connector = Connector.bootstrap();
    }
    execute(params, callback: (err, data ?: any) => void): void {
        callback({ codeFailure : 'Lack of execute function within query class'})
    }

    protected getDataByQuery( query , callback : (err , data ?: any ) => void ) : void{
        this.connector.centralQuery( query , (err, results) => {
            console.log('query res length ' + results && results.length)
            if(err)
                callback(err);
            else
                callback(null , results);
        })
    }

    protected getDataById( id , callback : (err , data ?: any ) => void ) : void{
        this.connector.queryById( id , (err, doc) => {
            console.log('fetch ' + doc)
            if(err)
                callback(err);
            else
                callback(null , doc);
        })
    }
}