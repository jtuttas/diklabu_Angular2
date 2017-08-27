import {Component} from "@angular/core";
import {Course} from "./data/Course";

@Component({
  selector: 'courseselect',
  templateUrl: './CourseSelectComponent.html',
  styleUrls: ['./CourseSelectComponent.css']
})

export class CourseSelectComponent{
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
  }

  toNumber(){
    console.log(this.courseid);
  }

  filterChanged() {
    console.log("Filter Changed to "+this.filter);
    this.courses = this.allCourses.filter(x => x.coursename.includes(this.filter));
  }
}
