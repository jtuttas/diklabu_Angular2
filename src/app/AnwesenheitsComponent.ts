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

@Component({
  selector: 'anwesenheit',
  templateUrl: './AnwesenheitsComponent.html',
  styleUrls: ['AnwesenheitsComponent.css'],

})

export class AnwesenheitsComponent implements OnInit {
  @ViewChild('mailDialog') mailDialog;
  @ViewChild('infoDialog') infoDialog;

  public mailObject:MailObject=new MailObject("","","","");

  errorMessage: string;
  subscription: Subscription;
  cols: any[];
  data: any[];
  multiSortMeta = [];
  KName: string;
  von: Date;
  bis: Date;

  constructor(private service:SharedService,private anwesenheitsService: AnwesenheitsService,private messageService: MessageService,private dokuService:DokuService) {
  }

  ngOnInit() {
    console.log("INIT Anwesenheitskomponente");
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("Anwesenheits Component constructor !"+message.constructor.name);
      this.update();
    });
    this.dokuService.setDisplayDoku(true,"Anwesenheit");
    this.update();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    console.log("After View INIT Anwesenheitskomponente");
  }

  update() {
    this.KName=CourseBookComponent.courseBook.course.KNAME;
    this.von=CourseBookComponent.courseBook.fromDate;
    this.bis=CourseBookComponent.courseBook.toDate;
    this.cols = new Array();
    this.buildCols(CourseSelectComponent.pupils);
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
    let from= CourseBookComponent.courseBook.fromDate;
    let to = CourseBookComponent.courseBook.toDate;
    while (from <= to) {
      this.cols.push({field: "id"+CourseBook.toSQLString(from),header: CourseBook.toReadbleString(from)});
      //this.cols.push({DATUM: CourseBook.toSQLString(from)+"T00:00:00",field:"dummy"});
      console.log ("Erzeuge Spalte: id"+CourseBook.toIDString(from));
      from=new Date(from.getTime()+1000*60*60*24);
    }

    //p[0].id20170913="a";
    this.data=p;

    this.anwesenheitsService.getAnwesenheit().subscribe(
      anwesenheit => {this.insertAnwesenheit(anwesenheit); console.log ("Insgesamt "+anwesenheit.length+" Einträge  empfangen!");this.cols.push({field: "empty",header: "empty"});},
      error =>  this.errorMessage = <any>error);
  }

  /**
   * Eintragen der Anwesenheitseinträge in die Tabelle
   * @param {Anwesenheit[]} a
   */
  insertAnwesenheit(a:Anwesenheit[]) {
    console.log("Trage Anwesenheit ein "+a.length);
    for (var i=0;i<a.length;i++) {
      // Finde den richtigen Schüler
      var found=false;
      var j=0;
      for (j=0;j<this.data.length && found==false;j++) {
        if (this.data[j].id==a[i].id_Schueler) {
          found=true;
        }
      }
      console.log("Zeile gefunden, Zeile ist "+j)


      let eintraeg:Anwesenheitseintrag[] = a[i].eintraege;
      console.log("Für den Schüler gibt es "+eintraeg.length+" Einträge");


      // Anwesenheitseinträge in diese Zeile als Attribut eintragen
      for (var k=0;k<eintraeg.length;k++) {
        let eintrag: Anwesenheitseintrag = a[i].eintraege[k];
          //console.log("Vergleiche "+this.cols[s].DATUM+" mit "+eintrag.DATUM);
        this.data[j-1]['id'+CourseBook.toSQLString(new Date(eintrag.DATUM))]= eintrag.VERMERK;
        this.data[j-1]['idkuk'+CourseBook.toSQLString(new Date(eintrag.DATUM))]= eintrag.ID_LEHRER;
        this.data[j-1]['idb'+CourseBook.toSQLString(new Date(eintrag.DATUM))]= eintrag.BEMERKUNG;

      }
    }

    console.log ("Data is:"+JSON.stringify(this.data));
    console.log ("cols is:"+JSON.stringify(this.cols));
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
    this.data[event.index]['idkuk'+event.column.field.substring(2)]= CourseBookComponent.courseBook.idLehrer;
    let anwesenheit:Anwesenheitseintrag = new Anwesenheitseintrag();
    anwesenheit.ID_LEHRER=CourseBookComponent.courseBook.idLehrer;
    anwesenheit.ID_KLASSE=CourseBookComponent.courseBook.course.id;
    anwesenheit.ID_SCHUELER=event.data.id;
    anwesenheit.VERMERK=event.data[event.column.field];
    anwesenheit.DATUM=event.column.field.substring(2)+"T00:00:00";
    console.log("Sende zum Server =>"+JSON.stringify(anwesenheit));
    if (anwesenheit.VERMERK=="") {
      console.log("Lösche Anwesenheitseintrag!");
      this.anwesenheitsService.deleteAnwesenheit(anwesenheit);
    }
    else {
      this.anwesenheitsService.setAnwesenheit(anwesenheit).subscribe(
        anwesenheit => {
          console.log("Empfange " + JSON.stringify(anwesenheit))
          if (anwesenheit.parseError) {
            this.messageService.add({severity:'error', summary:'Fehler', detail:'Formatierungfehler im Vermerk '+anwesenheit.VERMERK});
          }
        }
      );
    }
  }
}
