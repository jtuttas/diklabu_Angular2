///<reference path="../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, Input} from '@angular/core';

@Component({
  selector: 'datepickerComponent',
  templateUrl: 'datepickerComponent.html',
  styleUrls: ['./datepickerComponent.css']
})
export class DatepickerComponent {
  @Input() titel: string;
  d: Date = new Date();

  onChange(event): void{
    this.d=event;
    console.log('changed!' + event.toString());
    console.log('d=' + this.d.toString());
  }
}
