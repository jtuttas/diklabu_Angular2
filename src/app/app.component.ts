import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
    console.log('test');
  }

  getAdd(t1: number, t2: number): number {
    return t1 + t2;
  }
}
