///<reference path="../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, EventEmitter, Input, Output, ViewContainerRef} from '@angular/core';
import {ComponentChangedListener} from "./data/ComponentChangedListener";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'duration',
  templateUrl: 'durationPickerComponent.html',
  styleUrls: ['./durationPickerComponent.css']
})
export class DurationPickerComponent {
  @Output() durationUpdated = new EventEmitter();

  public fromDate: Date = new Date();
  public toDate: Date = new Date();

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.fromDate.setHours(0,0,0,0);
    this.toDate.setHours(23,59,59,0);
  }

  fromChange(event): void {
    this.fromDate = event;
    //console.log("from="+this.fromDate.getTime()+" to="+this.toDate.getTime());
    if (this.fromDate.getTime() > this.toDate.getTime()) {
      //console.log("FEHLER");
      this.toastr.info('Start-Datum muss vor dem End-Datum liegen!', 'Hinweis!');
    }
    this.durationUpdated.emit(this);
  }
  toChange(event): void {
    this.toDate = event;
    this.toDate.setHours(23,59,59,0);
    //console.log("from="+this.fromDate.getTime()+" to="+this.toDate.getTime());
    if (this.fromDate.getTime() > this.toDate.getTime()) {
      //console.log("FEHLER");
      this.toastr.info('Start-Datum muss vor dem End-Datum liegen!', 'Hinweis!');
    }
    this.durationUpdated.emit(this);
  }
  toString() : void {
    console.log(" from: "+this.fromDate+" to "+this.toDate);
  }
}
