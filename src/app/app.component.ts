import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {CourseBook} from "./data/CourseBook";
import {ComponentChangedListener} from "./data/ComponentChangedListener";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements ComponentChangedListener{

  componentChanged(c:any): void {
    console.log("component Changed !!"+c);
    if (c===this.durationPickerComponent || c===this.courseComponent) {
      console.log("component duration oder course !!");
      AppComponent.courseBook.fromDate = this.durationPickerComponent.fromDate;
      AppComponent.courseBook.toDate = this.durationPickerComponent.toDate;
      AppComponent.courseBook.course = this.courseComponent.getSelectedCourse();
      this.listVerlaufComponent.getVerlauf();
    }
    else if (c===this.verlaufComponent) {
      console.log("component Verlaufkomponente !!");
      this.listVerlaufComponent.addVerlauf(this.verlaufComponent.verlauf);
    }
  }

  @ViewChild('durationComponent') durationPickerComponent;
  @ViewChild('courseComponent') courseComponent;
  @ViewChild('newVerlaufComponent') verlaufComponent;
  @ViewChild('listVerlaufComponent') listVerlaufComponent;

  public static courseBook:CourseBook;
  public static SERVER="http://localhost:8080/"

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  componentInit(){
    AppComponent.courseBook = new CourseBook(this.durationPickerComponent.fromDate,this.durationPickerComponent.toDate,this.courseComponent.getSelectedCourse());
    console.log("NGInit!");
    this.listVerlaufComponent.getVerlauf();
  }


  testClick() {
    AppComponent.courseBook.toString();
    this.verlaufComponent.toString();
  }
}
