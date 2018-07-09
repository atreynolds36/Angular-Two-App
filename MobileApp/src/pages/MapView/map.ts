import {Component, ViewChild , ElementRef } from "@angular/core";
import {DataStore} from "../../shared/services/global.datastore.service";

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

@Component({
  selector : 'map-view',
  templateUrl : 'map.html'
})
export class MapController{

  @ViewChild('map') mapElement: ElementRef;
  map : GoogleMap;
  constructor(private datastore : DataStore ){
    console.log('mapping')
  }

  ionViewDidLoad(){
    console.log('load map');
    let mapOptions = {
      center: {
        lat : this.datastore.lat,
        lng : this.datastore.lng
      },
      zoom: 15
    };
    this.map = GoogleMaps.create(this.mapElement.nativeElement, mapOptions);
  }
}
