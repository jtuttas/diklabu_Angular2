import {Component, Input, ViewChild} from "@angular/core";
import {CourseBook} from "./data/CourseBook";
import {SharedService} from "./SharedService";
import {Course} from "./data/Course";
import {DurationPickerComponent} from "./DurationPickerComponent";


@Component({
  selector: 'coursebook',
  templateUrl: './CourseBookComponent.html',
})

export class CourseBookComponent {
  public static courseBook: CourseBook;
  private cb:CourseBook=new CourseBook(new Date(),new Date(),new Course(0,"NN"));


  constructor(private service: SharedService) {
  }

  ngAfterViewInit() {
  }

  courseUpdated(e:Course) {
    console.log("Course Updated!"+e.KNAME);
    this.cb.course=e;
    this.service.courseBookChanged(this.cb);
  }

  durationUpdated(e:DurationPickerComponent) {
    console.log(" Duration updated!");
    this.cb.fromDate=e.fromDate;
    this.cb.toDate=e.toDate;
    this.service.courseBookChanged(this.cb);
  }
}
