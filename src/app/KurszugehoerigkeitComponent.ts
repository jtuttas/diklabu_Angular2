import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {Pupil} from "./data/Pupil";
import {CourseSelectComponent} from "./CourseSelectComponent";
import {SharedService} from "./services/SharedService";
import {Subscription} from "rxjs/Subscription";
import {PupilService} from "./services/PupilService";
import {MessageService} from "primeng/components/common/messageservice";
import {CourseBookComponent} from "./CourseBookComponent";
import {CourseService} from "./services/CourseService";
@Component({
  selector: 'verwaltung',
  templateUrl: './KurszugehoerigkeitComponent.html',
})

export class KurszugehoerigkeitComponent {
  @ViewChild('editDialog') editDialog;

  editedPupil:Pupil;

  allPupils: Pupil[];
  orgAll:Pupil[];

  coursePupils: Pupil[];
  orgCourse: Pupil[];

  subscription: Subscription;
  courseName="Schüler des Kurses "+CourseBookComponent.courseBook.course.KNAME;

  constructor(private service:SharedService,private pupilServive:PupilService,private messageService: MessageService,public courseService:CourseService) {
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("KurszugehoerigkeitComponent Component Model Changed !"+message.constructor.name);
      this.coursePupils = new Array();
      this.coursePupils=CourseSelectComponent.pupils.map(x => Object.assign({}, x));
      this.coursePupils=this.coursePupils.sort((obj1: Pupil, obj2: Pupil) => {
        return obj1.NNAME.localeCompare(obj2.NNAME);
      });
      this.orgCourse=this.coursePupils.map(x => Object.assign({}, x));
      this.courseName = "Schüler des Kurses "+CourseBookComponent.courseBook.course.KNAME;
    });
    this.coursePupils = new Array();
    this.coursePupils=CourseSelectComponent.pupils.map(x => Object.assign({}, x));
    this.coursePupils=this.coursePupils.sort((obj1: Pupil, obj2: Pupil) => {
      return obj1.NNAME.localeCompare(obj2.NNAME);
    });
    this.orgCourse=this.coursePupils.map(x => Object.assign({}, x));
    this.courseName = "Schüler des Kurses "+CourseBookComponent.courseBook.course.KNAME;

    this.courseName = "Schüler des Kurses "+CourseBookComponent.courseBook.course.KNAME;


  }
  ngOnInit() {
     this.coursePupils=CourseSelectComponent.pupils.map(x => Object.assign({}, x));
     this.pupilServive.getAllPupils().subscribe(
       data => {
         this.allPupils= data;
         this.orgAll= new Array();
         this.allPupils=this.allPupils.map(x => Object.assign({}, x));
         this.allPupils= this.allPupils.sort((obj1: Pupil, obj2: Pupil) => {
           return obj1.NNAME.localeCompare(obj2.NNAME);
         });
         this.orgAll=this.allPupils.map(x => Object.assign({}, x));
       },
       err => {
         this.messageService.add({severity:'error', summary:'Fehler', detail:'Fehler beim laden aller Schüler: '+err});
       }
     );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  moveToTarget(event) {
    console.log("items.length="+event.items.length+" all.length="+this.allPupils.length);
    if (this.allPupils.length!=0) {
      this.allPupils=[];
      this.allPupils=this.orgAll.map(x => Object.assign({}, x));

      console.log("Move to Traget " + JSON.stringify(event));
      for (var i = 0; i < event.items.length; i++) {
        this.addPupil(event.items[i]);
      }
      console.log("Pupils size="+this.allPupils.length);
    }
  }
  moveToSource(event) {
    console.log("Move to Source "+JSON.stringify(event));
    this.allPupils=[];
    this.allPupils=this.orgAll.map(x => Object.assign({}, x));

    for (var i=0;i<event.items.length;i++) {
      this.removePupil(event.items[i]);
    }
  }

  moveAllToTaget(event) {
    this.messageService.add({severity:'error', summary:'Fehler', detail:'Funktion nicht zulässig!'});
    this.allPupils=[];
    this.allPupils=this.orgAll.map(x => Object.assign({}, x));
    this.coursePupils=[];
    this.coursePupils=this.orgCourse.map(x => Object.assign({}, x));
  }

  private addPupil(p:Pupil) {
    this.pupilServive.addPupilToCourse(p, CourseBookComponent.courseBook.course).subscribe(
      data => {
        //this.allPupils=new Array();
        //this.allPupils=this.orgAll.map(x => Object.assign({}, x));

        if (!data.success) {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Fehler beim Hinzufügen von ' + p.VNAME + ' ' + p.NNAME + " zum Kurs " + CourseBookComponent.courseBook.course.KNAME + ':' + data.msg
          });
          this.coursePupils=this.orgCourse.map(x => Object.assign({}, x));
        }
        else {
          console.log("Füge hinzu zur Liste "+JSON.stringify(p));
          CourseSelectComponent.pupils.push(p);
          this.orgCourse.push(p);
          this.courseService.anzahl=CourseSelectComponent.pupils.length;
        }


      },
      err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Fehler beim Hinzufügen von ' + p.VNAME + ' ' + p.NNAME + " zum Kurs " + CourseBookComponent.courseBook.course.KNAME + ':' + err
        });
      }
    );
  }

  private removePupil(p:Pupil) {
    this.pupilServive.removePupilFromCourse(p, CourseBookComponent.courseBook.course).subscribe(
      data => {
        this.allPupils=new Array();
        this.allPupils=this.orgAll.map(x => Object.assign({}, x));

        if (!data.success) {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Fehler beim Entfernen von ' + p.VNAME + ' ' + p.NNAME + " zum Kurs " + CourseBookComponent.courseBook.course.KNAME + ':' + data.msg
          });
          this.coursePupils=this.orgCourse.map(x => Object.assign({}, x));
        }
        else {
          CourseSelectComponent.pupils = CourseSelectComponent.pupils.filter(obj => obj.id != p.id);
          this.orgCourse = this.orgCourse.filter(obj => obj.id != p.id);
          this.courseService.anzahl=CourseSelectComponent.pupils.length;
        }


      },
      err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Fehler beim Entfernen von ' + p.VNAME + ' ' + p.NNAME + " zum Kurs " + CourseBookComponent.courseBook.course.KNAME + ':' + err
        });
      }
    );
  }

  editPupil(p:Pupil) {
    this.editedPupil=p;
    console.log("Edit Pupil "+JSON.stringify(p));
    this.editDialog.showDialog(p);
  }

  editCompleted(event:Pupil) {
    console.log("Edit Completed: "+JSON.stringify(event));
    let p:Pupil = this.allPupils.find(x => x.id == event.id);
    p.VNAME=event.VNAME;
    p.NNAME=event.NNAME;
    p.ABGANG=event.ABGANG;
    p = this.orgAll.find(x => x.id == event.id);
    p.VNAME=event.VNAME;
    p.NNAME=event.NNAME;
    p.ABGANG=event.ABGANG;
    p = this.coursePupils.find(x => x.id == event.id);
    if (p) {
      p.VNAME = event.VNAME;
      p.NNAME = event.NNAME;
      p.ABGANG = event.ABGANG;
    }
    p = this.orgCourse.find(x => x.id == event.id);
    if (p) {
      p.VNAME = event.VNAME;
      p.NNAME = event.NNAME;
      p.ABGANG = event.ABGANG;
    }
    p = CourseSelectComponent.pupils.find(x => x.id == event.id);
    if (p) {
      p.VNAME = event.VNAME;
      p.NNAME = event.NNAME;
      p.ABGANG = event.ABGANG;
      this.courseService.anzahl=CourseSelectComponent.pupils.filter(x=> x.ABGANG=="N").length;
    }

  }
}
