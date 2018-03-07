/**
 * Created by areynolds2 on 10/26/2017.
 */
import {Component, OnInit , Output , Input , EventEmitter , OnDestroy  } from '@angular/core';

import {Subject, Observable} from 'rxjs';
@Component({
  selector: 'my-typeahead',
  templateUrl: './template.html',
  styleUrls: ['../../app.component.css']
})

export class MyTypeahead implements OnInit, OnDestroy {
  focus : boolean = false;

  foodType : string;
  results : any[];
  @Output() inputChange = new EventEmitter<string>();
  @Input() subject : Subject<string>;
  @Input() observeResults : Observable< any[] >;
  @Input() key : string;
  @Input() placeholder : string;
  constructor(){
  }

  ngOnInit(){
    this.observeResults.subscribe( (results) => this.results = results );
  }

  ngOnDestroy(){}

  setFoodType(val){
    console.log(val);
    this.foodType = val[this.key];
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
