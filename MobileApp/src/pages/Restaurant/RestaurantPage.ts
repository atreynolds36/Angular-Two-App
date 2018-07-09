import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Restaurant, RestaurantPointer} from "../../shared/types/api";
import {ApiService} from "../../shared/services/api-service";

@Component({
  templateUrl : 'RestaurantPage.html'
})
export class RestaurantPage{

  myRestaurant : Restaurant;
  restaurantInputPointer : RestaurantPointer;

  loadRestaurantFromServer : boolean;

  restaurantName : string;
  constructor(private navParams : NavParams , private api : ApiService ){
    //can pass in either restaurant or restaurantPointer
    if( navParams.data.restaurant ){
      if( navParams.data.isPointer ){
        this.loadRestaurantFromServer = true;
        this.restaurantInputPointer = navParams.data.restaurant as RestaurantPointer;
        this.restaurantName = this.restaurantInputPointer.name;
      } else{
        this.myRestaurant = navParams.data.restaurant as Restaurant;
        this.restaurantName = this.myRestaurant.name;
      }
    }else{
      console.error('restaurant page opened with no restaurant');
    }
  }

  ngOnInit(){
    if( this.loadRestaurantFromServer ){
      //load Restaurant from server
      let resId = this.restaurantInputPointer.id;
      this.api.getRestaurantById( resId ).then( (result : Restaurant ) => {
          this.myRestaurant = result;
      });
    }
  }

}
