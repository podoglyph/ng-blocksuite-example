import { Component } from '@angular/core';
import './element'; // <-- import the web component

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngblock';
}
