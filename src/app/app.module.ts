import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routing } from './app.routing';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

import { createFillingComponent } from './createFilling/createFilling.component';
import { RegisteredAgentComponent } from './registeredAgent/registeredAgent.component';
import { AttorneyComponent } from './attorney/attorney.component';
import { DefendantComponent } from './defendant/defendant.component';

@NgModule({
  declarations: [
    AppComponent,
    createFillingComponent,
    RegisteredAgentComponent,
    AttorneyComponent,
    DefendantComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
