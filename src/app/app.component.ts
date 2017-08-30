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

  componentChanged(): void {
    console.log("component Changed !!");
    AppComponent.courseBook.fromDate=this.durationPickerComponent.fromDate;
    AppComponent.courseBook.toDate=this.durationPickerComponent.toDate;
    AppComponent.courseBook.course=this.courseComponent.getSelectedCourse();
  }

  @ViewChild('durationComponent') durationPickerComponent;
  @ViewChild('courseComponent') courseComponent;
  @ViewChild('newVerlaufComponent') verlaufComponent;

  public static courseBook:CourseBook;
  public static SERVER="http://localhost:8080/"

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  componentInit(){
    AppComponent.courseBook = new CourseBook(this.durationPickerComponent.fromDate,this.durationPickerComponent.toDate,this.courseComponent.getSelectedCourse());
    console.log("NGInit!");
  }


  testClick() {
    AppComponent.courseBook.toString();
    this.verlaufComponent.toString();
  }
}
