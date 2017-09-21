import {Component, Input, ViewChild} from "@angular/core";
import {CourseBook} from "./data/CourseBook";
import {SharedService} from "./services/SharedService";
import {Course} from "./data/Course";
import {DurationPickerComponent} from "./DurationPickerComponent";


@Component({
  selector: 'coursebook',
  templateUrl: './CourseBookComponent.html',
})

export class CourseBookComponent {
  public static courseBook: CourseBook=new CourseBook(new Date(new Date().getTime()-7*24*60*60*1000),new Date(),new Course(0,"NN"));


  constructor(private service: SharedService) {
  }

  ngAfterViewInit() {
  }

  courseUpdated(e:Course) {
    console.log("Course Updated!"+e.KNAME);
    CourseBookComponent.courseBook.course=e;
    this.service.courseBookChanged(CourseBookComponent.courseBook);
  }

  durationUpdated(e:DurationPickerComponent) {
    console.log(" Duration updated!");
    CourseBookComponent.courseBook.fromDate=e.fromDate;
    CourseBookComponent.courseBook.toDate=e.toDate;
    this.service.courseBookChanged(CourseBookComponent.courseBook);
  }
}
