export const Restaurant_Schema = [
    'name' , 'type' , 'address' , 'lat' , 'lng'
];



//grade is 55-60-95-100
//price range is 1-5
//MM-DY-YEAR
export const Ratings_Schema = [
    'restaurant_id' , 'food_name' , 'food_type' , 'grade' , 'price_range' , 'date'
];

//example
// name - bbq chicken pizza
// simplified_name - PIZZA
// type - ITALIAN
export const Meals_Schema = [
    'name' , 'simplified_name' , 'type'
];

export interface RestaurantInterface{
    name : string,
    type : string,
    address : string,
    lat : number,
    lng : number
}

export interface RatingInterface{
    food_name : string,
    grade : number,
    price_range : number,
    date : Date
}

export class MongoDocument {
    constructor() { }
    validate() : boolean{
        for (let prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (!this[prop])
                    return false;
            }
        }
        return true;
    }
    isValidDate(val : string) {
        let y = val && val.split('-');
        return y && y.length == 3;
    }
}

export class Restaurant extends MongoDocument implements RestaurantInterface{
    name : string;
    type : string;
    address : string;
    lat : number;
    lng : number;
    _id : Object;
    gid : string;
    cuisineTypesArray : Array<string>;
    ratings : Array<Rating>;
    constructor( payload : any ){
        super();
        this.gid = payload.gid;
        this.name = payload.name;
        this.type = payload.type;
        this.address = payload.address;
        this.lat = typeof payload.lat == 'number' ? payload.lat : parseFloat(payload.lat);
        this.lng = typeof payload.lng == 'number' ? payload.lng : parseFloat(payload.lng);
        this.ratings = payload.ratings || [] ;
    }
}

export class Rating extends MongoDocument implements RatingInterface{
    food_name : string;
    grade : number;
    price_range : number;
    date : Date;
    userId : number;
    constructor(payload : any){
        super();
        this.food_name = payload.food_name && payload.food_name.toUpperCase();
        this.grade = parseInt(payload.grade);
        this.price_range = parseInt(payload.price_range);
        this.date = this.isValidDate(payload.date) ? new Date(payload.date) : undefined;
        //default to 1
        this.userId = payload.id || 1 ;
    }

    get() : Object {
        return {
            food : this.food_name,
            score : this.grade,
            rateDate : this.date,
            userId : this.userId,
            price : this.price_range
        }
    }
}