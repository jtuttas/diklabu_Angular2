import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {Pupil} from "./data/Pupil";
import {SharedService} from "./services/SharedService";
import {Subscription} from "rxjs/Subscription";
import {AnwesenheitsService} from "./services/AnwesenheitsService";
import {Anwesenheit} from "./data/Anwesenheit";
import {CourseBookComponent} from "./CourseBookComponent";
import {CourseBook} from "./data/CourseBook";
import {Anwesenheitseintrag} from "./data/Anwesenheitseintrag";
import {AppComponent} from "./app.component";
import {MessageService} from "primeng/components/common/messageservice";
import {Message} from "primeng/primeng";
import {CourseSelectComponent} from "./CourseSelectComponent";
import {MailObject} from "./data/MailObject";
import {DokuService} from "./services/DokuService";
import {NotenService} from "./services/NotenService";
import {Schuljahr} from "./data/Schuljahr";
import {Grades, Grade} from "./data/Grades";

@Component({
  selector: 'noten',
  templateUrl: './NotenComponent.html',
  styleUrls: [],

})

export class NotenComponent {
  @ViewChild('mailDialog') mailDialog;
  @ViewChild('infoDialog') infoDialog;
  @ViewChild('lfselectComponent') lfSelectComponent;

  public mailObject:MailObject=new MailObject("","","","");

  subscription: Subscription;
  cols: any[];
  data: any[];
  KName: string;

  constructor(private service:SharedService,private notenService:NotenService,private messageService: MessageService,private dokuService:DokuService) {
  }

  ngOnInit() {
    console.log("INIT Notenkomponente");
    this.subscription = this.service.getCoursebook().subscribe(message => {
      this.update();
    });
    this.dokuService.setDisplayDoku(true,"Notenliste");
    this.update();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  lfLoaded() {
    for (var i=0;i<this.cols.length;i++) {
      if (this.cols[i].field.startsWith("lf")) {
        this.lfSelectComponent.removeLf(this.cols[i].field.substr(2));
      }
    }
  }

  addLf(e) {
    console.log("Add LF:"+JSON.stringify(e));
    console.log("Selected LF="+this.lfSelectComponent.getSelectedLernfeld())
    this.cols.splice(this.cols.length-1,0, {field: "lf"+this.lfSelectComponent.getSelectedLernfeld(), header: this.lfSelectComponent.getSelectedLernfeld()+" ("+CourseBookComponent.courseBook.idLehrer+")", idlk: CourseBookComponent.courseBook.idLehrer});
    this.lfSelectComponent.removeLf(this.lfSelectComponent.getSelectedLernfeld());
  }

  getIdTeacher():string {
    return CourseBookComponent.courseBook.idLehrer;
  }

  update() {
    this.KName=CourseBookComponent.courseBook.course.KNAME;
    this.cols = new Array();
    this.buildCols(CourseSelectComponent.pupils);
    this.notenService.getCurrentYear().subscribe(
      data => {
        let sj:Schuljahr=data;
        CourseBookComponent.courseBook.idSchuljahr=sj.ID;
        this.notenService.getGrades(CourseBookComponent.courseBook.course.KNAME,sj.ID).subscribe(
          data => {
            console.log ("Folgende Noten empfange: "+JSON.stringify(data));
            this.insertNoten(data);

          },
          err => {
            this.messageService.add({severity:'error', summary:'Fehler', detail:'Fehler beim Laden der Noten f. die Klasse '+CourseBookComponent.courseBook.course.KNAME});
          }
        );
      },
      err => {
        this.messageService.add({severity:'error', summary:'Fehler', detail:'Kann kein aktuelles Schuljahr laden!'});
      });
  }

  /**
   * Eintragen der Noten in die Tabelle
   * @param {Anwesenheit[]} a
   */
  insertNoten(g:Grades[]) {
    for (var i=0;i<g.length;i++) {
      // Finde den richtigen Schüler
      var found=false;
      var j=0;
      for (j=0;j<this.data.length && found==false;j++) {
        if (this.data[j].id==g[i].schuelerID) {
          found=true;
        }
      }
      if (found) {
        console.log("Zeile gefunden, Zeile ist " + j)
      }
      else {
        console.log("ACHTUNG Zeile nicht gefunden, das ist unmöglich !!");
      }


      let grade:Grade[] = g[i].noten;
      console.log("Für den Schüler gibt es "+grade.length+" Einträge");


      // Noteneinträge in diese Zeile als Attribut eintragen
      for (var k=0;k<grade.length;k++) {
        let eintrag: Grade = g[i].noten[k];
        //console.log("Vergleiche "+this.cols[s].DATUM+" mit "+eintrag.DATUM);
        this.data[j-1]['lf'+eintrag.ID_LERNFELD]= eintrag.WERT;
        if (!this.cols.find(obj => obj.field=="lf"+eintrag.ID_LERNFELD)) {
          this.cols.push({field: "lf"+eintrag.ID_LERNFELD, header: eintrag.ID_LERNFELD+" ("+eintrag.ID_LK+")", idlk: eintrag.ID_LK});
        }

      }
    }
    this.cols.push({field: "empty",header: "empty"});
    console.log ("Data is:"+JSON.stringify(this.data));
    console.log ("cols is:"+JSON.stringify(this.cols));

  }

  /**
   * Erzeigt die Spalten der Tabelle und trägt anschließend die Daten ein
   * @param {any[]} p Array mit Schülern
   */
  buildCols(p:any[]) {
    this.data = new Array();
    this.cols.push({field: "info",header: "info"});
    this.cols.push({field: "VNAME",header: "Vorname"});
    this.cols.push({field: "NNAME",header: "Nachname"});
    this.data=p;
  }


  mailClick(p) {
    console.log("0Mail click! on "+JSON.stringify(p));
    this.mailObject = new MailObject(CourseBookComponent.courseBook.email,p.EMAIL,"","");
    this.mailDialog.showDialog("Nachricht an "+p.VNAME+" "+p.NNAME);
  }

  infoClick(p:Pupil) {
    console.log("Info click! on "+JSON.stringify(p));
    this.infoDialog.showDialog(p);
  }

  edit(event) {
    console.log("edit Complete: row="+event.index+" Column="+event.column.field+" Inhalt:"+JSON.stringify(event.data));
    let g:Grade=new Grade();
    g.ID_LK=CourseBookComponent.courseBook.idLehrer;
    g.ID_LERNFELD=event.column.field.substring(2);
    g.ID_SCHUELER=event.data.id;
    g.WERT=event.data[event.column.field];
    console.log("Sende Note zum Server: "+JSON.stringify(g));
    if (g.WERT=="") {
      console.log("Note löschen")
      this.notenService.deleteGrade(g).subscribe(
        data => {
          if (!data.success) {
            this.messageService.add({severity: 'error', summary: 'Fehler', detail: data.msg});
          }
          for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].id == data.ID_SCHUELER) {
              console.log(" Note lokal löschen!");
              delete this.data[i]['lf' + data.ID_LERNFELD];
              break;
            }
          }
        },
        err => {
          this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
        }
      );
    }
    else {
      console.log("Note eintragen/ändern")
      this.notenService.setGrade(g, CourseBookComponent.courseBook.course.id).subscribe(
        data => {
          if (!data.success) {
            this.messageService.add({severity: 'error', summary: 'Fehler', detail: data.msg});
            for (var i = 0; i < this.data.length; i++) {
              if (this.data[i].id == data.ID_SCHUELER) {
                console.log(" Note lokal löschen!");
                delete this.data[i]['lf' + data.ID_LERNFELD];
                break;
              }
            }
          }
          else {
            for (var i = 0; i < this.data.length; i++) {
              if (this.data[i].id == data.ID_SCHUELER) {
                console.log(" Note lokal eingetragen!");
                this.data[i]['lf' + data.ID_LERNFELD] = data.WERT;
                break;
              }
            }
          }
        },
        err => {
          this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
        }
      );
    }
  }
}
