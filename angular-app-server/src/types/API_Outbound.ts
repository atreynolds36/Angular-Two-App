interface PublicRestaurant {
    _id : number;
    averageScore : number;
    name : string,
    type : string,
    address : string,
    lat : number,
    lng : number,
    ratings : Array<LineItemRating>
}

interface LineItemRating {
    count : number;
    lastRated : Date,
    userId : number,
    price : number,
    food  : string
    score : number;
}

interface PublicRating extends LineItemRating{
    restaurant : {
        id : number,
        name : string,
        lat : number,
        lng : number,
        address : string
    }
}
