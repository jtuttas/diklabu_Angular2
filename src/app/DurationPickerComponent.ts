///<reference path="../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, EventEmitter, Input, Output, ViewContainerRef} from '@angular/core';
import {MessageService} from "primeng/components/common/messageservice";
import {CourseBookComponent} from "./CourseBookComponent";

@Component({
  selector: 'duration',
  templateUrl: 'durationPickerComponent.html',
  styleUrls: ['./durationPickerComponent.css']
})
export class DurationPickerComponent {
  @Output() durationUpdated = new EventEmitter();

  de: any;

  public fromDate: Date = CourseBookComponent.courseBook.fromDate;
  public toDate: Date = CourseBookComponent.courseBook.toDate;

  constructor(private messageService: MessageService) {
    this.fromDate.setHours(0,0,0,0);
    this.toDate.setHours(23,59,59,0);
  }

  ngOnInit() {

      this.de = {
        firstDayOfWeek: 1,
        dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnestag", "Freitag", "Samstag"],
        dayNamesShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
        dayNamesMin: ["So","Mo","Di","Mi","Do","Fr","Sa"],
        monthNames: [ "Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember" ],
        monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Mai", "Jun","Jul", "Aug", "Sep", "Okt", "Nov", "Dez" ],
        today: 'Heute',
        clear: 'löschen'
      };

  }

  fromChange(event): void {
    this.fromDate = event;
    //console.log("from="+this.fromDate.getTime()+" to="+this.toDate.getTime());
    if (this.fromDate.getTime() > this.toDate.getTime()) {
      //console.log("FEHLER");
      this.messageService.add({severity:'warning', summary:'Warnung', detail:'Start-Datum muss vor dem End-Datum liegen!'});
    }
    this.durationUpdated.emit(this);
  }
  toChange(event): void {
    this.toDate = event;
    this.toDate.setHours(23,59,59,0);
    //console.log("from="+this.fromDate.getTime()+" to="+this.toDate.getTime());
    if (this.fromDate.getTime() > this.toDate.getTime()) {
      //console.log("FEHLER");
      this.messageService.add({severity:'warning', summary:'Warnung', detail:'Start-Datum muss vor dem End-Datum liegen!'});
    }
    this.durationUpdated.emit(this);
  }
  toString() : void {
    console.log(" from: "+this.fromDate+" to "+this.toDate);
  }
}
