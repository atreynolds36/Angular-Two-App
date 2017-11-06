/**
 * Created by areynolds2 on 10/26/2017.
 */
import {Component, OnInit , Output , EventEmitter } from '@angular/core';

import { Api } from '../../../../../services/api.service';
import { MasterData } from '../../../../../types/db_objects';

@Component({
  selector: 'crv-typeahead',
  templateUrl: './template.html',
  styleUrls: ['../../../../../app.component.css']
})

export class CRVTypeahead{
  focus : boolean = false;
  results : MasterData[];
  foodType : string;
  @Output() inputChange = new EventEmitter<string>();

  constructor(private api : Api){}

  searchTextEnterFn(event : any){
    console.log( event.target.value );
    this.sendSearchRequests( event.target.value );
  }

  sendSearchRequests(filterVal : string ){
    this.api
      .getFoodMasterDataValues(filterVal)
      .then( res => this.results = res );
  }

  setFoodType(val){
    console.log(val);
    this.foodType = val;
    this.focus = false;
    this.inputChange.emit(val);
  }
  onFocus(){
    this.focus = true;
  }

  onFocusOut(event : any ){
    setTimeout( () => {
      this.focus = false;
    } , 5 );
  }
}
