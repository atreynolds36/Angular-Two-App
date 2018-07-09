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
  restaurant : RestaurantPointer
}

export interface RestaurantPointer{
  id : string,
  lat : number,
  lng : number,
  address : string,
  name : string
}

export interface MasterData{
  values : string
}

export interface Cuisine{
  value : string,
  label : string
}

export interface APIQueryResults{
  queryInfo : {
    type : string,
    length : number
  },
  results : Array<Restaurant> | Array<Rating>
}

export interface GoogleResults{
  predictions : Array<GoogleLocation>
}

export interface GoogleLocation{
  description : string,
  place_id : string,
  structued_formatting : {
    //name of restaurant
    main_text : string,
    //location string
    secondary_text : string
  }
}
