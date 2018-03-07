import { NgModule } from "@angular/core";
import { DataStore } from "../../services/global.datastore.service";

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [ DataStore ], // <======================= PROVIDE THE SERVICE
})
export class SharedServicesModule { }
