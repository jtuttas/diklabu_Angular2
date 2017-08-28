import {Component, Input} from "@angular/core";
import {Course} from "./data/Course";
import {ComponentChangedListener} from "./data/ComponentChangedListener";
import {AppComponent} from "./app.component";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'courseselect',
  templateUrl: './CourseSelectComponent.html',
  styleUrls: ['./CourseSelectComponent.css']
})

export class CourseSelectComponent{
  @Input() listner: ComponentChangedListener;

  public courseid:number=0;
  public filter:string="";
  public allCourses;
  public courses;



  constructor(http:HttpClient){


    // Make the HTTP request:
    http.get(AppComponent.SERVER+"Diklabu/api/v1/noauth/klassen").subscribe(data => {
      // Read the result field from the JSON response.
      this.courses = data;
      this.allCourses=this.courses;
      this.listner.componentInit();
      //console.log(JSON.stringify(this.courses));
    });
    console.log("Construktor CourseSelectComponent");
  }


  updated(){
    this.listner.componentChanged();
  }

  getSelectedCourse():Course {
    console.log("Number of Courses="+this.courses.length);
    console.log("get selected Course="+this.courses[this.courseid].KNAME);
    return this.courses[this.courseid];
  }

  filterChanged() {
    console.log("Filter Changed to "+this.filter);
    this.courses = this.allCourses.filter(x => x.KNAME.includes(this.filter));
  }
}
