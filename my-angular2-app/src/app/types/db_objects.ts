export interface Restaurant{
  _id : number
  name : string,
  type : string,
  address : string,
  lat : number,
  lng : number,
  ratings : Array<Rating>
}

export interface Rating{
  count : number,
  food : string,
  score : number,
  lastRated : Date,
  restaurant : string,
  lat : number,
  lng : number,
  address : string
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
