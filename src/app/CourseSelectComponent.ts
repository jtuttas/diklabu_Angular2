import {Component, Input, ViewContainerRef} from "@angular/core";
import {Course} from "./data/Course";
import {ComponentChangedListener} from "./data/ComponentChangedListener";
import {AppComponent} from "./app.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ToastsManager} from "ng2-toastr";


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
  public compDisabled:boolean=true;



  constructor(http:HttpClient,public toastr: ToastsManager, vcr: ViewContainerRef){
    this.toastr.setRootViewContainerRef(vcr);

    // Make the HTTP request:
    http.get(AppComponent.SERVER+"Diklabu/api/v1/noauth/klassen").subscribe(data => {
      // Read the result field from the JSON response.
      this.courses = data;
      this.allCourses=this.courses;
      this.listner.componentInit();
      this.compDisabled=false;
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
