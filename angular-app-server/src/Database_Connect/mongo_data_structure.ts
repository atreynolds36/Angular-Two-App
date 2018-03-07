interface MongoRestaurant{
    _id : number,
    name : string,
    type : string,
    address : string,
    lat : number,
    lng : number,
    cuisineTypesArray : Array<String>,
    ratings : Array<MongoRatings>
}
interface MongoRatings{
    count ?: number //DEPRECATED,
    rateDate : Date,
    userId : number,
    price : number,
    food  : string
    score : number;
}