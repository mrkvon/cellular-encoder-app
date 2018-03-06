import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { AsciiComponent } from './ascii/ascii.component';
import { AutomatonComponent } from './automaton/automaton.component';


@NgModule({
  declarations: [
    AppComponent,
    AsciiComponent,
    AutomatonComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
