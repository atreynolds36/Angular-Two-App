export class RestaurantDO{

    dbRecord : MongoRestaurant;
    ratings : Array<LineItemRating>;

    constructor( dbRecord : MongoRestaurant ){
        this.dbRecord = dbRecord;
        this.condenseRatings();
    }

    getAPIOutgoingStructure() : PublicRestaurant{
        let totalScore = this.calculateTotalScore();
        return <PublicRestaurant>{
            _id : this.dbRecord._id,
            averageScore : totalScore,
            name : this.dbRecord.name,
            type : this.dbRecord.type,
            address : this.dbRecord.address,
            lat : this.dbRecord.lat,
            lng : this.dbRecord.lng,
            ratings : this.ratings
        }
    }

    private condenseRatings(){
        this.ratings = Array<LineItemRating>();

        for( let rating of this.dbRecord.ratings ){
            let tempRating = this.existingFoodRating( rating.food );
            if( tempRating ){
                let totalscore = tempRating.count * tempRating.score;
                totalscore += rating.score;
                tempRating.count++;
                tempRating.score = totalscore / tempRating.count;
            }else{
                this.ratings.push(<LineItemRating>{
                    count : rating.count || 1,
                    food : rating.food,
                    lastRated : rating.rateDate,
                    price : rating.price,
                    userId : rating.userId,
                    score : rating.score
                });
            }
        }
    }
    private calculateTotalScore() : number {
        let revTotal = 0;
        let revCount = 0;
        this.ratings.forEach( (rating) => {
            revCount += rating.count;
            revTotal += rating.score * rating.count;
        });
        return revTotal / revCount ;
    }

    private existingFoodRating ( food : string ) : LineItemRating {
        for( let rating of this.ratings ){
            if( rating.food == food )
                return rating;
        }
        return null;
    }
}