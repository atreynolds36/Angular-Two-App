import { NgModule  }           from '@angular/core';
import { CommonModule }       from '@angular/common'
import { FormsModule } from '@angular/forms';

import { MainComponent } from './components/main/main.component';
import {ListViewComponent} from './components/list-view/list-view.component';
import { MapComponent } from './components/map/map.component';
import { KrvMarker } from './components/map/map-marker/marker.component';

import { ListItemRatingComponent } from './components/list-view/inline-rating-component/inline-rating-component';
import { RatingsListComponent } from './components/ratings-list/ratings-list.component';

import { AgmCoreModule } from '@agm/core';


import { Api } from '../../services/api.service';
import { LandingPageApiService } from './services/landing-page.api.service';
import { LandingPageDataHub } from './services/landing-page-data-hub.service';

import { LandingPageRouter } from './landing-page.router.module';

import { CRVTypeahead } from './components/main/crv-typeahead/typeahead';

@NgModule({
  imports:      [ CommonModule , FormsModule ,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBGl1fMQneNqJqqco8G-Ptluhm7qkd01B8'
    }),
    LandingPageRouter ],
  declarations: [ MainComponent , CRVTypeahead , ListViewComponent , ListItemRatingComponent , RatingsListComponent,
                  MapComponent , KrvMarker ],
  /* exports:      [ MainComponent ], */
  providers:    [ Api , LandingPageApiService , LandingPageDataHub ]
})
export class LandingPageModule { }
