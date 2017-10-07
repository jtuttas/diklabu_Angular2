import {Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from "@angular/core";
import {Course} from "./data/Course";
import {AppComponent} from "./app.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/components/common/messageservice";
import {PupilService} from "./services/PupilService";
import {Pupil} from "./data/Pupil";
import {MailObject} from "./data/MailObject";
import {CourseBookComponent} from "./CourseBookComponent";
import {CourseService} from "./services/CourseService";


@Component({
  selector: 'courseselect',
  templateUrl: './CourseSelectComponent.html',
  styleUrls: ['./CourseSelectComponent.css']
})

export class CourseSelectComponent{
  @Output() courseUpdated = new EventEmitter();
  @ViewChild('mailDialog') mailDialog;
  @ViewChild('planDialog') planDialog;
  @ViewChild('courseInfoDialog') courseInfoDialog;

  public mailObject:MailObject=new MailObject("","","","");
  private course: Course;

  public courseid:number=0;
  public filter:string="";
  public allCourses;
  public courses;
  public compDisabled:boolean=true;
  public anzahl=0;
  public static pupils:Pupil[];

  constructor(http:HttpClient,private messageService: MessageService, private pupilService:PupilService, private courseService:CourseService){

    // Make the HTTP request:
    http.get(AppComponent.SERVER+"Diklabu/api/v1/noauth/klassen").subscribe(data => {
      // Read the result field from the JSON response.
      console.log("CourseSelectComponent receive: "+JSON.stringify(data));
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
          this.messageService.add({severity:'error', summary:'Fehler', detail:'Kann Klassenliste nicht vom Server laden! MSG='+err.error.message});

        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.messageService.add({severity:'error', summary:'Fehler', detail:'Kann Klassenliste nicht vom Server laden! MSG='+err.error.message});
        }

    });
    console.log("Construktor CourseSelectComponent");
  }


  updated(){
    this.course=this.courses[this.courseid];
    console.log("CourseSelecComponent updated():"+this.course.KNAME);
    this.pupilService.getPupils(this.course.KNAME)
      .subscribe(
        pupils => {CourseSelectComponent.pupils=pupils;
          this.anzahl=pupils.length;
          this.courseUpdated.emit(this.course);
          console.log ("Insgesamt "+pupils.length+" Schüler  empfangen!")}
      )
  }


  filterChanged() {
    console.log("Filter Changed to "+this.filter);
    this.courses = this.allCourses.filter(x => x.KNAME.includes(this.filter));
    this.courseid=0;
    this.updated();
  }

  mailPupils() {
    console.log("Mail Pupils click! ");
    this.mailObject = new MailObject(CourseBookComponent.courseBook.email,CourseBookComponent.courseBook.email,"","");
    for (var i=0;i<CourseSelectComponent.pupils.length;i++) {
      this.mailObject.addCC(CourseSelectComponent.pupils[i].EMAIL);
    }
    this.mailDialog.showDialog("Klasse "+CourseBookComponent.courseBook.course.KNAME+" anschreiben");
  }

  stundenplan() {
    console.log("Stundenplan anfragen!");

    this.courseService.getStundenplan(CourseBookComponent.courseBook.course.KNAME).subscribe(
      data => {
        console.log("Receive Stundenplan:"+data);
        if (data.length>0) {
          this.planDialog.showDialog("Stundenplan f. die Klasse "+CourseBookComponent.courseBook.course.KNAME,data);
        }
        else {
          this.messageService.add({severity:'warning', summary:'Warnung', detail:"Kein Stundenplan f. die Klasse "+CourseBookComponent.courseBook.course.KNAME+" gefunden!"});
        }
      },
      err=> {
        this.messageService.add({severity:'error', summary:'Fehler', detail:err});
      }
    );
  }

  vertretungsplan() {
    console.log("Vertertungsplan anfragen!");

    this.courseService.getVertretungsplan(CourseBookComponent.courseBook.course.KNAME).subscribe(
      data => {
        console.log("Receive Verterungsplan:"+data);
        if (data.length>0) {
          this.planDialog.showDialog("Vertretungsplan f. die Klasse "+CourseBookComponent.courseBook.course.KNAME,data);
        }
        else {
          this.messageService.add({severity:'warning', summary:'Warnung', detail:"Kein Vertretungsplan f. die Klasse "+CourseBookComponent.courseBook.course.KNAME+" gefunden!"});
        }
      },
      err=> {
        this.messageService.add({severity:'error', summary:'Fehler', detail:err});
      }
    );
  }

  courseinfo() {
    this.courseService.getCourseInfo(CourseBookComponent.courseBook.course.id).subscribe(
      data => {
        console.log("Receive CourseInfo:"+JSON.stringify(data));
        this.courseInfoDialog.bem=data.NOTIZ;
        this.courseInfoDialog.lvname=data.LEHRER_VNAME;
        this.courseInfoDialog.lnname=data.LEHRER_NNAME;
        this.courseInfoDialog.lemail=data.LEHRER_EMAIL;
        this.courseInfoDialog.mailto="mailto:"+data.LEHRER_EMAIL;
        this.courseInfoDialog.showDialog("Info f. die Klasse "+CourseBookComponent.courseBook.course.KNAME,"Info f. die Klasse "+CourseBookComponent.courseBook.course.id);
      },
      err=> {
        this.messageService.add({severity:'error', summary:'Fehler', detail:err});
      }
    );

  }
  mailCompanies() {
    console.log("Mail Companies click! ");
    this.mailObject = new MailObject(CourseBookComponent.courseBook.email,CourseBookComponent.courseBook.email,"","");
    this.pupilService.getCompanies(CourseBookComponent.courseBook.course.KNAME).subscribe(
      data => {
          console.log("Empfange Betriebe "+JSON.stringify(data));
          for (var i=0;i<data.length;i++) {
            this.mailObject.addBCC(data[i].email);
          }
       },
      err => {
          console.log("Fehler Liste Betriebe"+err);
          this.messageService.add({severity:'error', summary:'Fehler', detail:err});
       }
    );
    this.mailDialog.showDialog("Betriebe der Klasse "+CourseBookComponent.courseBook.course.KNAME+" anschreiben");
  }
}
