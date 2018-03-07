import { Component } from '@angular/core';
import { DataStore } from './services/global.datastore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  // initial center position for the map
  lat: number = 40.743991;
  lng: number = -74.032363;

  constructor( private data : DataStore ){
    data.setLocation( this.lat , this.lng );
    data.setUser( 1 );
  }
}
