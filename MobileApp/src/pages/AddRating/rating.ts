import {Component} from "@angular/core";
import {AlertController, LoadingController, NavController} from "ionic-angular";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {OptionsList} from "../../shared/types/ui-types";
import {GoogleLocation, MasterData} from "../../shared/types/api";
import {AutocompleteApiService} from "../../shared/services/autocomplete-api-service";
import {ApiService} from "../../shared/services/api-service";

@Component({
  selector : 'add-rating-view',
  templateUrl : 'rating.html'
})
export class AddRatingPage{

  restaurantSubject$ = new Subject<string>();
  searchResultListObservable : Observable<OptionsList[]>;

  errorMsg : string;

  constructor(public nav : NavController , autocompleteService : AutocompleteApiService , public loadingCntrl : LoadingController ,
              private apiService : ApiService , public alertCntrl : AlertController ){
    this.searchResultListObservable = autocompleteService.handleAutoCompleteByGoogleLocation( this.restaurantSubject$ )
      .map( ( masterdata : GoogleLocation[] ) => {
        return masterdata.map( ( glocation ) => {
          return <OptionsList>{ label : glocation.description , val : glocation.place_id }
        });
      });
  }

  takeFromTH($event){
    console.log($event);
  }

  submitRating(restaurantId : string , food : string , score : string , price : string , date : string ){
    let payload = {
      google_place_id : restaurantId,
      food_name       : food,
      grade : score,
      date : date,
      price_range : price
    };
    if( this.validatePayload( payload ) ){
      let loadingMsg = this.loadingCntrl.create({
        content : 'Saving Score...',
        spinner : 'dots'
      });
      loadingMsg.present();

      this.apiService.postAddRating( payload ).then( () => {
        loadingMsg.dismiss();
        this.nav.pop();
      });
    } else{
      let prompt = this.alertCntrl.create({
        message : this.errorMsg
      });
      prompt.present();
    }
  }

  private validatePayload( payload ) : boolean {
    this.errorMsg = undefined;
    if( ! payload.google_place_id )
      this.errorMsg = "Restaurant is required";
    if( ! payload.food_name )
      this.errorMsg = "Food type is required";
    if( payload.grade ){
      if( isNaN( parseInt( payload.grade) ) )
        this.errorMsg = "Score must be a number between 0-99";
      if( parseInt(payload.grade) < 0 || parseInt( payload.grade ) > 100 )
        this.errorMsg = "Score must be a number between 0-99";
    }
    if( payload.date ){
      if( new Date(payload.date).toString() == 'Invalid Date' )
        this.errorMsg = "Date is not valid";
    }
    if( payload.price_range ){
      if( isNaN( parseInt( payload.price_range) ) )
        this.errorMsg = "Score must be a number between 0-5";
      if( parseInt(payload.price_range) < 0 || parseInt( payload.price_range ) > 5 )
        this.errorMsg = "Score must be a number between 0-5";
    }

    return this.errorMsg ? false : true ;
  }
}
