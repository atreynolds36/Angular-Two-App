export interface GeoCodeResponseData{
  geometry : {
    location : {
      lat : string,
      lng : string
    }
  }
}

export interface GeoCodeResponse{
  results : GeoCodeResponseData[]
}
