"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RestaurantDO {
    constructor(dbRecord) {
        this.dbRecord = dbRecord;
        this.condenseRatings();
    }
    getAPIOutgoingStructure() {
        let totalScore = this.calculateTotalScore();
        return {
            _id: this.dbRecord._id,
            averageScore: totalScore,
            name: this.dbRecord.name,
            type: this.dbRecord.type,
            address: this.dbRecord.address,
            lat: this.dbRecord.lat,
            lng: this.dbRecord.lng,
            ratings: this.ratings
        };
    }
    condenseRatings() {
        this.ratings = Array();
        for (let rating of this.dbRecord.ratings) {
            let tempRating = this.existingFoodRating(rating.food);
            if (tempRating) {
                let totalscore = tempRating.count * tempRating.score;
                totalscore += rating.score;
                tempRating.count++;
                tempRating.score = totalscore / tempRating.count;
            }
            else {
                this.ratings.push({
                    count: rating.count || 1,
                    food: rating.food,
                    lastRated: rating.rateDate,
                    price: rating.price,
                    userId: rating.userId,
                    score: rating.score
                });
            }
        }
    }
    calculateTotalScore() {
        let revTotal = 0;
        let revCount = 0;
        this.ratings.forEach((rating) => {
            revCount += rating.count;
            revTotal += rating.score * rating.count;
        });
        return revTotal / revCount;
    }
    existingFoodRating(food) {
        for (let rating of this.ratings) {
            if (rating.food == food)
                return rating;
        }
        return null;
    }
}
exports.RestaurantDO = RestaurantDO;
