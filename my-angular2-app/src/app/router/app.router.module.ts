import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddRatingView , AddRestaurantView , AddMealView } from '../components/add-form-views';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path : 'addRating' , component : AddRatingView },
  { path : 'addRestaurant' , component: AddRestaurantView },
  { path : 'addMeal' , component : AddMealView }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
