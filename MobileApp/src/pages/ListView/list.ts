import {Component, OnInit} from "@angular/core";
import {PageDataHub} from "../../shared/services/page-data-hub.service";
import {Restaurant, Rating, MasterData, Cuisine, RestaurantPointer} from "../../shared/types/api";
import {AutocompleteApiService} from "../../shared/services/autocomplete-api-service";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ApiService} from "../../shared/services/api-service";
import {OptionsList} from "../../shared/types/ui-types";
import {App, NavController, Option} from "ionic-angular";
import { PreferredCuisineList } from "../../shared/data/default_presets";

import { RestaurantPage } from "../Restaurant/RestaurantPage";

enum ActivePanel{
  RESTAURANTLIST,
  RATINGSLIST
}

@Component({
  selector : 'list-view',
  templateUrl : 'list.html'
})
export class ListController implements OnInit{

  searchType : string = 'TOPRATED' ;

  activePanel = 'RESTAURANT';
  restaurantList : Restaurant[];
  ratingsList : Rating[];

  ifLoading : boolean;

  searchFoodVal$ = new Subject<string>();
  searchResultListObservable : Observable<OptionsList[]>;

  searchCuisineVal$ = new Subject<string>();
  searchResultListObservableForCuisine : Observable<OptionsList[]>;
  cuisinePreferedList : OptionsList[];

  constructor( private datahub : PageDataHub , private autocomplete : AutocompleteApiService, private api : ApiService ,
               public app : App ){
    console.log('listing');
    this.searchResultListObservable = this.autocomplete.handleAutoCompleteByFood( this.searchFoodVal$ )
      .map( ( masterdata : MasterData[] ) => {
        return masterdata.map( (masterdata) => {
          return <OptionsList>{ label : masterdata.values , val : masterdata.values }
        });
      });
  }

  ngOnInit(){
    this.fetchTopRestaurantsInAreaData();
    this.datahub.getRefreshStream()
      .subscribe( () => {
        this.fetchTopRestaurantsInAreaData();
      });

    this.searchResultListObservableForCuisine = this.autocomplete.handleAutoCompleteByCuisine( this.searchCuisineVal$ )
      .map( ( cuisine : Cuisine[] ) => {
        return cuisine.map( cuisine => {
          return <OptionsList>{ label : cuisine.label , val : cuisine.value }
        });
      })

    this.cuisinePreferedList = PreferredCuisineList;
  }

  fetchTopRestaurantsInAreaData(){
    //show loading
    console.log('fetching restaurants');
    this.ifLoading = true;
    this.datahub.getRestaurantListObservable()
      .subscribe( (list) => {
        this.restaurantList = list;
        console.log('returned here');
        this.ifLoading = false;
      });
  }

  searchSwitch( newValue ){
    this.searchType = newValue;
    if( newValue == 'BYCUISINE' ){

    }

  }


  searchRatingsByFood(val){
    console.log(val);
    if(val){
      this.ifLoading = true;
      this.api.getRatingsByFoodType( val ).subscribe( (results : Rating[] ) => {
        console.log('ok return');
        this.ratingsList = results;
        this.activePanel = 'RATING';
        this.ifLoading = false;
      })
    } else{
      this.activePanel = 'RESTAURANT';
      this.restaurantList = this.datahub.getCurrentRestaurantList();
    }
  }

  searchRatingsByCuisine(val){
    if(val){
      this.api.getRatingsByCuisine( val ).subscribe( ( results : Rating[] ) => {
        this.ratingsList = results;
        this.activePanel = "RATING";
        this.ifLoading = false;
      });
    }
  }

  goToRestaurantPage( root : Restaurant | RestaurantPointer , isPointer ?: boolean ){
    this.app.getRootNav().push( RestaurantPage , {
      restaurant : root,
      isPointer : isPointer
    });
  }


  showNoResults() : boolean {
    if( this.activePanel == 'RATING '){
      return ( this.ratingsList && this.ratingsList.length == 0 )
    }else if( this.activePanel == 'RESTAURANT'){
      return ( this.restaurantList && this.restaurantList.length == 0 )
    }
    return false;
  }
}
