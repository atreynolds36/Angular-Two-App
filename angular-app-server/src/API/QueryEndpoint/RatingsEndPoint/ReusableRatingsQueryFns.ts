import {RestaurantDO} from "../../../DataObjects/Restaurant";

export default{
    filterRatingsByFoodName : (results : Array<RestaurantDO> , food_name : string ) => {
        let ratingsList : Array<PublicRating> = Array<PublicRating>();

        let res : RestaurantDO , pubRating : PublicRating ;
        for( res of results){
            for(let rating of res.ratings){
                if(rating.food == food_name.toUpperCase() ){
                    pubRating = wrapRatingToPublicRating( rating , res );
                    ratingsList.push(pubRating);
                }
            }
        }
        return ratingsList;
    },

    combineRestaurantRatings : ( results : Array<RestaurantDO> ) => {
        let ratingsList : Array<PublicRating> = Array<PublicRating>();
        let res : RestaurantDO , pubRating : PublicRating ;
        for( res of results ){
            for(let rating of res.ratings ){
                pubRating = wrapRatingToPublicRating( rating , res );
                ratingsList.push(pubRating);
            }
        }
        return ratingsList;
    },

    wrapRatingToPublicRating : wrapRatingToPublicRating
}

function wrapRatingToPublicRating( rating : LineItemRating | MongoRatings , res : RestaurantDO ) : PublicRating {
    let pubRating = Object.assign({} , rating ) as PublicRating;
    pubRating.restaurant = {
        id : res.dbRecord._id,
        lat : res.dbRecord.lat,
        lng : res.dbRecord.lng,
        address : res.dbRecord.address,
        name : res.dbRecord.name
    };
    return pubRating;
}