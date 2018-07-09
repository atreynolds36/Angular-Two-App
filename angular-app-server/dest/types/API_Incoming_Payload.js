"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant_Schema = [
    'name', 'type', 'address', 'lat', 'lng'
];
exports.Ratings_Schema = [
    'restaurant_id', 'food_name', 'food_type', 'grade', 'price_range', 'date'
];
exports.Meals_Schema = [
    'name', 'simplified_name', 'type'
];
class MongoDocument {
    constructor() { }
    validate() {
        for (let prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (!this[prop])
                    return false;
            }
        }
        return true;
    }
    isValidDate(val) {
        let y = val && val.split(/[-\/]/);
        return y && y.length == 3;
    }
}
exports.MongoDocument = MongoDocument;
class Restaurant extends MongoDocument {
    constructor(payload) {
        super();
        this.gid = payload.gid;
        this.name = payload.name;
        this.type = payload.type;
        this.address = payload.address;
        this.lat = typeof payload.lat == 'number' ? payload.lat : parseFloat(payload.lat);
        this.lng = typeof payload.lng == 'number' ? payload.lng : parseFloat(payload.lng);
        this.ratings = payload.ratings || [];
    }
}
exports.Restaurant = Restaurant;
class Rating extends MongoDocument {
    constructor(payload) {
        super();
        this.food_name = payload.food_name && payload.food_name.toUpperCase();
        this.grade = parseInt(payload.grade);
        this.price_range = parseInt(payload.price_range);
        this.date = this.isValidDate(payload.date) ? new Date(payload.date) : undefined;
        this.userId = payload.id || 1;
    }
    get() {
        return {
            food: this.food_name,
            score: this.grade,
            rateDate: this.date,
            userId: this.userId,
            price: this.price_range
        };
    }
}
exports.Rating = Rating;
