import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ascii = 97;

  public onChange(ascii) {
    this.ascii = ascii;
  }
}
