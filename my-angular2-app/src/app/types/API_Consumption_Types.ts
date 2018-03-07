//Should match API_Outbound Server interface

export interface Restaurant{
  _id : number;
  averageScore : number;
  name : string,
  type : string,
  address : string,
  lat : number,
  lng : number,
  ratings : Array<Rating>
}

export interface Rating{
  count : number;
  lastRated : Date,
  userId : number,
  price : number,
  food  : string
  score : number;
  restaurant : {
    id : number,
    lat : number,
    lng : number,
    address : string,
    name : string
  }
}

export interface MasterData{
  values : string
}

export interface APIQueryResults{
  queryInfo : {
    type : string,
    length : number
  },
  results : Array<Restaurant> | Array<Rating>
}


