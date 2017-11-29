///<reference path="../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, Input} from '@angular/core';


@Component({
  selector: 'datepickerComponent',
  templateUrl: 'datepickerComponent.html',
  styleUrls: ['./datepickerComponent.css']
})
export class DatepickerComponent {
  @Input() titel: string;

  de: any;

  public d: Date = new Date();

  constructor() {
    this.d.setHours(0,0,0,0);
  }

  ngOnInit() {

    this.de = {
      firstDayOfWeek: 1,
      dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnestag", "Freitag", "Samstag"],
      dayNamesShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
      dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
      today: 'Heute',
      clear: 'löschen'
    };
  }

    onChange(event): void {
    this.d = event;
    this.d.setHours(0,0,0,0);
    console.log('changed!' + event.toString());
    console.log('d=' + this.d.toString());
  }
}
