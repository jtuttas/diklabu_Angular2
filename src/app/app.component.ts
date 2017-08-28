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
    console.log("Component Changed ! from="+this.fromDateComponent+" to="+this.toDateComponent);
    AppComponent.courseBook.fromDate=this.fromDateComponent.d;
    AppComponent.courseBook.toDate=this.toDateComponent.d;
    AppComponent.courseBook.course=this.courseComponent.getSelectedCourse();
  }

  @ViewChild('fromDateComponent') fromDateComponent;
  @ViewChild('toDateComponent') toDateComponent;
  @ViewChild('courseComponent') courseComponent;

  public static courseBook:CourseBook;

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.toastr.success('You are awesome!', 'Success!');
  }

  ngOnInit(){
    AppComponent.courseBook = new CourseBook(this.fromDateComponent.d,this.toDateComponent.d,this.courseComponent.getSelectedCourse());
    console.log("NGInit!");
  }


  testClick() {
    AppComponent.courseBook.toString();
    console.log(this.fromDateComponent.d);
  }
}
