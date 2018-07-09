"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    filterRatingsByFoodName: (results, food_name) => {
        let ratingsList = Array();
        let res, pubRating;
        for (res of results) {
            for (let rating of res.ratings) {
                if (rating.food == food_name.toUpperCase()) {
                    pubRating = wrapRatingToPublicRating(rating, res);
                    ratingsList.push(pubRating);
                }
            }
        }
        return ratingsList;
    },
    combineRestaurantRatings: (results) => {
        let ratingsList = Array();
        let res, pubRating;
        for (res of results) {
            for (let rating of res.ratings) {
                pubRating = wrapRatingToPublicRating(rating, res);
                ratingsList.push(pubRating);
            }
        }
        return ratingsList;
    },
    wrapRatingToPublicRating: wrapRatingToPublicRating
};
function wrapRatingToPublicRating(rating, res) {
    let pubRating = Object.assign({}, rating);
    pubRating.restaurant = {
        id: res.dbRecord._id,
        lat: res.dbRecord.lat,
        lng: res.dbRecord.lng,
        address: res.dbRecord.address,
        name: res.dbRecord.name
    };
    return pubRating;
}
