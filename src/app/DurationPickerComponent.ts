///<reference path="../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, Input, ViewContainerRef} from '@angular/core';
import {ComponentChangedListener} from "./data/ComponentChangedListener";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'duration',
  templateUrl: 'durationPickerComponent.html',
  styleUrls: ['./durationPickerComponent.css']
})
export class DurationPickerComponent {
  @Input() listner: ComponentChangedListener;

  public fromDate: Date = new Date();
  public toDate: Date = new Date();

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  fromChange(event): void {
    this.fromDate = event;
    console.log("from="+this.fromDate.getTime()+" to="+this.toDate.getTime());
    if (this.fromDate.getTime() > this.toDate.getTime()) {
      console.log("FEHLER");
      this.toastr.info('Start-Datum muss vor dem End-Datum liegen!', 'Hinweis!');
    }
    this.listner.componentChanged();
  }
  toChange(event): void {
    this.toDate = event;
    console.log("from="+this.fromDate.getTime()+" to="+this.toDate.getTime());
    if (this.fromDate.getTime() > this.toDate.getTime()) {
      console.log("FEHLER");
      this.toastr.info('Start-Datum muss vor dem End-Datum liegen!', 'Hinweis!');
    }
    this.listner.componentChanged();
  }
  toString() : void {
    console.log(" from: "+this.fromDate+" to "+this.toDate);
  }
}
