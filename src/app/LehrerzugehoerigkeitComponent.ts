import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {Pupil} from "./data/Pupil";
import {CourseSelectComponent} from "./CourseSelectComponent";
import {SharedService} from "./services/SharedService";
import {Subscription} from "rxjs/Subscription";
import {PupilService} from "./services/PupilService";
import {MessageService} from "primeng/components/common/messageservice";
import {CourseBookComponent} from "./CourseBookComponent";
import {CourseService} from "./services/CourseService";
import {Teacher} from "./data/Teacher";
import {TeacherService} from "./services/TeacherService";
import {DokuService} from "./services/DokuService";
@Component({
  selector: 'verwaltung',
  templateUrl: './LehrerzugehoerigkeitComponent.html',
})

export class LehrerzugehoerigkeitComponent {

  role: string = CourseBookComponent.courseBook.role;

  allTeachers: Teacher[];
  orgAll:Teacher[];

  courseTeachers: Teacher[];
  orgCourse: Teacher[];

  subscription: Subscription;
  courseName="Lehrer der Klasse/des Kurses "+CourseBookComponent.courseBook.course.KNAME;

  constructor(private dokuService:DokuService, private service:SharedService,private teacherServive:TeacherService,private messageService: MessageService,public courseService:CourseService) {
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("LehrerzugehoerigkeitComponent Component Model Changed !"+message.constructor.name);
      this.courseName="Lehrer der Klasse/des Kurses "+CourseBookComponent.courseBook.course.KNAME;
      this.courseTeachers = new Array();
      this.teacherServive.getTeachersOfCourse(CourseBookComponent.courseBook.course).subscribe(
        data => {
          this.courseTeachers=data;
          this.courseTeachers=this.courseTeachers.sort((obj1: Teacher, obj2: Teacher) => {
            return obj1.id.localeCompare(obj2.id);
          });
          this.orgCourse=this.courseTeachers.map(x => Object.assign({}, x));

        },
        err => {
          this.messageService.add({severity:'error', summary:'Fehler', detail:'Kann Lehrer der Klasse '+CourseBookComponent.courseBook.course.KNAME+' nicht laden: '+err});
        }
      );
    });
    this.courseTeachers = new Array();
    this.teacherServive.getTeachersOfCourse(CourseBookComponent.courseBook.course).subscribe(
      data => {
        this.courseTeachers=data;
        this.courseTeachers=this.courseTeachers.sort((obj1: Teacher, obj2: Teacher) => {
          return obj1.id.localeCompare(obj2.id);
        });
        this.orgCourse=this.courseTeachers.map(x => Object.assign({}, x));

      },
      err => {
        this.messageService.add({severity:'error', summary:'Fehler', detail:'Kann Lehrer der Klasse '+CourseBookComponent.courseBook.course.KNAME+' nicht laden: '+err});
      }
    );
  }

  ngOnInit() {
//     this.coursePupils=CourseSelectComponent.pupils.map(x => Object.assign({}, x));
    this.dokuService.setDisplayDoku(false);
     this.teacherServive.getTeachers().subscribe(
       data => {
         this.allTeachers= data;
         this.orgAll= new Array();
         this.allTeachers=this.allTeachers.map(x => Object.assign({}, x));
         this.allTeachers= this.allTeachers.sort((obj1: Teacher, obj2: Teacher) => {
           return obj1.id.localeCompare(obj2.id);
         });
         this.orgAll=this.allTeachers.map(x => Object.assign({}, x));
       },
       err => {
         this.messageService.add({severity:'error', summary:'Fehler', detail:'Fehler beim laden aller Lehrer: '+err});
       }
     );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  moveToTarget(event) {
    console.log("items.length="+event.items.length+" all.length="+this.allTeachers.length);
    if (this.allTeachers.length!=0) {
      this.allTeachers=[];
      this.allTeachers=this.orgAll.map(x => Object.assign({}, x));

      console.log("Move to Traget " + JSON.stringify(event));
      for (var i = 0; i < event.items.length; i++) {
        this.addTeacher(event.items[i]);
      }
    }
  }
  moveToSource(event) {
    console.log("Move to Source "+JSON.stringify(event));
    this.allTeachers=[];
    this.allTeachers=this.orgAll.map(x => Object.assign({}, x));

    for (var i=0;i<event.items.length;i++) {
      this.removeTeacher(event.items[i]);
    }
  }

  moveAllToTaget(event) {
    this.messageService.add({severity:'error', summary:'Fehler', detail:'Funktion nicht zulässig!'});
    this.allTeachers=[];
    this.allTeachers=this.orgAll.map(x => Object.assign({}, x));
    this.courseTeachers=[];
    this.courseTeachers=this.orgCourse.map(x => Object.assign({}, x));
  }

  private addTeacher(p:Teacher) {
    this.teacherServive.addTeacherToCourse(p, CourseBookComponent.courseBook.course).subscribe(
      data => {
        //this.allPupils=new Array();
        //this.allPupils=this.orgAll.map(x => Object.assign({}, x));

        if (!data.success) {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Fehler beim Hinzufügen von ' + p.VNAME + ' ' + p.NNAME + " zum Kurs " + CourseBookComponent.courseBook.course.KNAME + ':' + data.msg
          });
          this.courseTeachers=this.orgCourse.map(x => Object.assign({}, x));
        }
        else {
          console.log("Füge hinzu zur Liste "+JSON.stringify(p));
        //          CourseSelectComponent.pupils.push(p);
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

  private removeTeacher(p:Teacher) {
    this.teacherServive.removeTeacherFromCourse(p, CourseBookComponent.courseBook.course).subscribe(
      data => {
        this.allTeachers=new Array();
        this.allTeachers=this.orgAll.map(x => Object.assign({}, x));

        if (!data.success) {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Fehler beim Entfernen von ' + p.VNAME + ' ' + p.NNAME + " zum Kurs " + CourseBookComponent.courseBook.course.KNAME + ':' + data.msg
          });
          this.courseTeachers=this.orgCourse.map(x => Object.assign({}, x));
        }
        else {
          // CourseSelectComponent.pupils = CourseSelectComponent.pupils.filter(obj => obj.id != p.id);
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

}
