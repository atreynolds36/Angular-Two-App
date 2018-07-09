//Typeahead component
//Can either be a search or a regular input



import {
  Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, AfterViewInit,
  Renderer2
} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {MasterData} from "../../shared/types/api";
import {
  App, Modal, Loading, LoadingController, Option, ViewController, Content, Scroll,
  NavController
} from "ionic-angular";
import {OptionsList} from "../../shared/types/ui-types";


@Component({
  selector : 'crv-typeahead-component',
  templateUrl : 'typeahead.html'
})
export class TypeaheadComponent implements OnInit,AfterViewInit{
    @Input('type') inputType : string;
    @Input() label : string;

    @Input() subjectSubmitVal : Subject<string>;
    @Output('selectedValueHandler') emitSelectedValue = new EventEmitter<string>();
    @Input() getResultingOptions : Observable< OptionsList[] >;
    @Input() defaultValue : string;
    @Input() preferenceList ?: OptionsList[];

    searchVal : string = '';
    //either SEARCH or DEFAULT
    myType : string;
    results : OptionsList[];
    inFocus : boolean;
    ifLoading : boolean;

    @ViewChild('resultsContainer') myListEl : ElementRef;
    @ViewChild('myResultSet') myResultSet : ElementRef;
    @ViewChild(Content) myContent : Content;
      //filterablePreferenceList : OptionsList[];
    showPreferedList : boolean;


    constructor( public loadingController : LoadingController , public viewController : ViewController , public app : App ,
                private renderer : Renderer2 , public navController : NavController ){
    }

    ngOnInit(){
      this.myType = this.inputType == 'search' ? 'SEARCH' : 'DEFAULT';
      this.getResultingOptions.subscribe( (results : OptionsList[] ) => {
        this.ifLoading = false;
        this.results = results;
      });
      if( this.defaultValue ) {
        this.searchVal = this.defaultValue;
      }

      if( this.preferenceList ){
        this.showPreferedList = true;
      }
    }

    ngAfterViewInit(){
      console.log( this.myListEl );
    }

    scrollEvent(e){
      console.log(e);
    }

    updateOptionsList(val) : void {
      if(val){
        this.subjectSubmitVal.next(val);
        this.inFocus = true;
        this.ifLoading = true;
      }
    }

    clearOptionsList() : void {
      this.onComponentBlur();
      this.emitSelectedValue.emit('');
    }

    setSelection(selection : OptionsList ) : void {
      this.searchVal = selection.label;
      if( this.searchVal.indexOf(',') > -1 ){
        this.searchVal = this.searchVal.split(',')[0];
      }

      this.emitSelectedValue.emit(selection.val);
      this.onComponentBlur();
    }

    onInputFocus(){
      console.log('we are focused');
      this.onComponentFocus();
    }

    scrollHere(e){
      console.log('reg');
    }

    onComponentFocus(){
      this.inFocus = true;
      let viewController = this.viewController.getContent();
      //hack
      //@ts-ignore
      let ionPageEl = this.viewController.getNav()._elementRef.nativeElement.querySelector('.ion-page').querySelector('.scroll-content');
      this.renderer.setStyle(ionPageEl , 'overflow-y' , 'hidden');
    }

    onComponentBlur(){
      this.inFocus = false;
      //hack
      //@ts-ignore
      let ionPageEl = this.viewController.getNav()._elementRef.nativeElement.querySelector('.ion-page').querySelector('.scroll-content');
      this.renderer.setStyle(ionPageEl , 'overflow-y' , 'scroll');
      this.ifLoading = false;
    }
}
