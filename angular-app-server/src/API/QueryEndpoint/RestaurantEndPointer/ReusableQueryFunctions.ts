/**
 * Created by areynolds2 on 10/20/2017.
 */


export default {
    getCloseAreaQuery : (latIn, lngIn ) => {
        let lat = parseFloat(latIn);
        let lng = parseFloat(lngIn);
        console.log(lat + .2);
        console.log(lng);
        return {lat: {$lt: lat + .2, $gt: lat - .2}, lng: {$lt: lng + .2, $gt: lng - .2}};
    },
    quickSort : quickSort,
    filterRatingsByFoodName : (results , food_name ) => {
        let ratingsList = [];
        for(let res of results){
            for(let rating of res.ratings){
                if(rating.food == food_name.toUpperCase() ){
                    rating.restaurant = res.name;
                    rating.lat = res.lat;
                    rating.lng = res.lng;
                    rating.address = res.address;
                    ratingsList.push(rating);
                }
            }
        }
        return ratingsList;
    }
}

function quickSort(arr, sortField , left, right){
    var len = arr.length,
        pivot,
        partitionIndex;
    if(left < right){
        pivot = right;
        partitionIndex = partition(arr, sortField , pivot, left, right);

        //sort left and right
        quickSort(arr, sortField , left, partitionIndex - 1);
        quickSort(arr, sortField , partitionIndex + 1, right);
    }
    return arr;
}

function partition(arr, sortField , pivot, left, right){
    var pivotValue = arr[pivot][sortField],
        partitionIndex = left;

    for(var i = left; i < right; i++){
        if(arr[i][sortField] > pivotValue){
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}
function swap(arr, i, j){
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}