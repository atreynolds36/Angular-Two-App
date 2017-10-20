/**
 * Created by areynolds2 on 10/19/2017.
 */

export interface BaseQueryHandlerInterface {
    execute: Function
    validate: Function
}

import { Connector } from '../../Database_Connect/connect';

//import { CoordinateQueryHandler } from './RestaurantEndPointer/coordinateQuery';

export class BaseQueryHandler{
    connector : Connector;
  //  findByAreaQueryHandler : CoordinateQueryHandler;

    constructor(){
        this.connector = Connector.bootstrap();
        //this.findByAreaQueryHandler = new CoordinateQueryHandler();
    }
    execute(params, callback: (err, data ?: any) => void): void {
        callback({ codeFailure : 'Lack of execute function within query class'})
    }
/*
    public getQueryHandler( filter ){
        switch( filter ){
            case 'coordinates' :
                return CoordinateQueryHandler;
            default :
                return null;
        }
    }
*/

    protected getDataByQuery( query , callback : (err , data ?: any ) => void ) : void{
        this.connector.query('central.db' , query , (err, results) => {
            if(err)
                callback(err);
            else
                callback(null , results);
        })
    }
}