import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

// Import the Http Module and our Data Service
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,                // <-Add HttpModule
    RouterModule
  ],
  providers: [DataService],   // <-Add DataService
  bootstrap: [AppComponent]
})
export class AppModule { 

  
}
