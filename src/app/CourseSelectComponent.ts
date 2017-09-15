import {Component, EventEmitter, Input, Output, ViewContainerRef} from "@angular/core";
import {Course} from "./data/Course";
import {AppComponent} from "./app.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ToastsManager} from "ng2-toastr";


@Component({
  selector: 'courseselect',
  templateUrl: './CourseSelectComponent.html',
  styleUrls: ['./CourseSelectComponent.css']
})

export class CourseSelectComponent{
  @Output() courseUpdated = new EventEmitter();
  private course: Course;

  public courseid:number=0;
  public filter:string="";
  public allCourses;
  public courses;
  public compDisabled:boolean=true;


  constructor(http:HttpClient,public toastr: ToastsManager, vcr: ViewContainerRef){
    this.toastr.setRootViewContainerRef(vcr);

    // Make the HTTP request:
    http.get(AppComponent.SERVER+"Diklabu/api/v1/noauth/klassen").subscribe(data => {
      // Read the result field from the JSON response.
      this.courses = data;
      this.allCourses=this.courses;
      this.compDisabled=false;
      this.updated();
    },

      (err: HttpErrorResponse) => {

        this.compDisabled=true;
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
          this.toastr.error('Kann Klassenliste nicht vom Server laden! MSG='+err.error.message, 'Fehler!');
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.toastr.error('Kann Klassenliste nicht vom Server laden! ('+err.name+')', 'Fehler!');
        }

    });
    console.log("Construktor CourseSelectComponent");
  }


  updated(){
    this.course=this.courses[this.courseid];
    console.log("CourseSelecComponent updated():"+this.course.KNAME);
    this.courseUpdated.emit(this.course);
  }


  filterChanged() {
    console.log("Filter Changed to "+this.filter);
    this.courses = this.allCourses.filter(x => x.KNAME.includes(this.filter));
    this.courseid=0;
    this.updated();
  }
}
