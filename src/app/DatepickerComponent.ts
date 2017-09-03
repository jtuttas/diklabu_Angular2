///<reference path="../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, Input} from '@angular/core';
import {ComponentChangedListener} from "./data/ComponentChangedListener";

@Component({
  selector: 'datepickerComponent',
  templateUrl: 'datepickerComponent.html',
  styleUrls: ['./datepickerComponent.css']
})
export class DatepickerComponent {
  @Input() titel: string;
  @Input() listner: ComponentChangedListener;

  public d: Date = new Date();

  constructor() {
    this.d.setHours(0,0,0,0);
  }

  onChange(event): void {
    this.d = event;
    this.d.setHours(0,0,0,0);
    if (this.listner!=undefined) {
      this.listner.componentChanged();
    }
    console.log('changed!' + event.toString());
    console.log('d=' + this.d.toString());

  }
}
