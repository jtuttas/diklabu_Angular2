import {Component, Input} from "@angular/core";
import {Course} from "./data/Course";
import {AppComponent} from "./app.component";
import {ComponentChangedListener} from "./data/ComponentChangedListener";


@Component({
  selector: 'courseselect',
  templateUrl: './CourseSelectComponent.html',
  styleUrls: ['./CourseSelectComponent.css']
})

export class CourseSelectComponent{
  @Input() listner: ComponentChangedListener;

  public courseid:number=0;
  public filter:string="";
  public allCourses:Array<Course>;
  public courses:Array<Course>;
  constructor(){

    this.courses=[];

    this.courses.push(new Course(0,"FISI1A"));
    this.courses.push(new Course(1,"FISI1B"));
    this.courses.push(new Course(2,"FISI1C"));
    this.courses.push(new Course(3,"FIAE1A"));

    this.allCourses=this.courses;
    console.log("Construktor CourseSelectComponent");
  }


  updated(){
    this.listner.componentChanged();
  }

  getSelectedCourse():Course {
    console.log("Number of Courses="+this.courses.length);
    console.log("get selected Course="+this.courses[this.courseid].coursename);
    return this.courses[this.courseid];
  }

  filterChanged() {
    console.log("Filter Changed to "+this.filter);
    this.courses = this.allCourses.filter(x => x.coursename.includes(this.filter));
  }
}
