/**
 * Created by areynolds2 on 10/3/2017.
 */

interface Rating{
    food : string,
    lastRated : Date,
    count : number,
    score : number
}

//RESTAURANT is Main Record
//List of Ratings
interface Record_Unused{
    name: string,
    type : string,
    address : string,
    lat : number,
    lng : number
    ratings : Array<Rating>
}