///<reference path="../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, Input} from '@angular/core';


@Component({
  selector: 'datepickerComponent',
  templateUrl: 'datepickerComponent.html',
  styleUrls: ['./datepickerComponent.css']
})
export class DatepickerComponent {
  @Input() titel: string;

  public d: Date = new Date();

  constructor() {
    this.d.setHours(0,0,0,0);
  }

  onChange(event): void {
    this.d = event;
    this.d.setHours(0,0,0,0);
    console.log('changed!' + event.toString());
    console.log('d=' + this.d.toString());
  }
}
