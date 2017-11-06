/**
 * Created by areynolds2 on 10/3/2017.
 */

interface DbRating{
    food : string,
    lastRated : Date,
    count : number,
    score : number
}

//RESTAURANT is Main Record
//List of Ratings
interface DbRecord{
    name: string,
    type : string,
    address : string,
    lat : number,
    lng : number
    ratings : Array<DbRating>
}