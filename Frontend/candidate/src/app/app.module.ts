import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {Ng2TelInputModule} from "ng2-tel-input";
import {MatTableModule} from "@angular/material/table";
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {StoreModule} from "@ngrx/store";
import {metaReducers, reducers} from "./app-state";
import {EffectsModule} from "@ngrx/effects";
import {CandidateEffects} from "./app-state/candidate.effects";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
  declarations: [
    AppComponent,
    CandidateDetailComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatMenuModule,
    GooglePlaceModule,
    HttpClientModule,
    Ng2TelInputModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    EffectsModule.forRoot([CandidateEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
