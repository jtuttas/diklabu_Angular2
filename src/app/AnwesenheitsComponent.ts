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
import {Termin, Termindaten} from "./data/Termin";
import {LoaderService} from "./loader/loader.service";

@Component({
  selector: 'anwesenheit',
  templateUrl: './AnwesenheitsComponent.html',
  styleUrls: ['AnwesenheitsComponent.css'],

})

export class AnwesenheitsComponent implements OnInit {
  @ViewChild('mailDialog') mailDialog;
  @ViewChild('infoDialog') infoDialog;
  @ViewChild('dataTable') dataTable;


  public mailObject:MailObject=new MailObject("","","","");

  public editedAnwesenheit:Anwesenheitseintrag=new Anwesenheitseintrag();

  event_data;
  event_column;

  termindaten:Termindaten[];

  selectedFilter1: Termin=new Termin("alle",0);
  selectedFilter2: Termin=new Termin("alle",0);
  errorMessage: string;
  subscription: Subscription;
  cols: any[];
  colsOrg: any[];
  data: any[];
  multiSortMeta = [];
  KName: string;
  von: Date;
  bis: Date;

  constructor(private loaderService:LoaderService, private service:SharedService,private anwesenheitsService: AnwesenheitsService,private messageService: MessageService,private dokuService:DokuService) {
  }

  ngOnInit() {
    console.log("INIT Anwesenheitskomponente");

    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("Anwesenheits Component Model Changed !"+message.constructor.name);
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
    console.log("Update startet");
    this.KName=CourseBookComponent.courseBook.course.KNAME;
    this.von=CourseBookComponent.courseBook.fromDate;
    this.bis=CourseBookComponent.courseBook.toDate;
    this.cols = new Array();
    this.colsOrg = new Array();

    this.buildCols(CourseSelectComponent.pupils);
    this.filterChanged({filter1: this.selectedFilter1,filter2: this.selectedFilter2})
    console.log("Update Ended");
    //this.applyFilter();
  }

  /**
   * Erzeigt die Spalten der Tabelle und trägt anschließend die Daten ein
   * @param {any[]} p Array mit Schülern
   */
  buildCols(p:any[]) {
    this.cols.push({field: "info",header: "info"});
    this.cols.push({field: "VNAME",header: "Vorname"});
    this.cols.push({field: "NNAME",header: "Nachname"});
    this.colsOrg.push({field: "info",header: "info"});
    this.colsOrg.push({field: "VNAME",header: "Vorname"});
    this.colsOrg.push({field: "NNAME",header: "Nachname"});
    this.data = new Array();
    this.cols.push({field: "info",header: "info"});
    this.cols.push({field: "VNAME",header: "Vorname"});
    this.cols.push({field: "NNAME",header: "Nachname"});
    this.colsOrg.push({field: "info",header: "info"});
    this.colsOrg.push({field: "VNAME",header: "Vorname"});
    this.colsOrg.push({field: "NNAME",header: "Nachname"});
    let from= CourseBookComponent.courseBook.fromDate;
    let to = CourseBookComponent.courseBook.toDate;
    while (from <= to) {
      this.cols.push({field: "id"+CourseBook.toSQLString(from),header: CourseBook.toReadbleString(from)});
      this.colsOrg.push({field: "id"+CourseBook.toSQLString(from),header: CourseBook.toReadbleString(from)});
      //this.cols.push({DATUM: CourseBook.toSQLString(from)+"T00:00:00",field:"dummy"});
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
        if (eintrag.BEMERKUNG) {
          this.data[j - 1]['bem' + CourseBook.toSQLString(new Date(eintrag.DATUM))] = eintrag.BEMERKUNG;
        }
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

  editStart(event) {
    console.log("edit Start: row="+event.index+" Column="+event.column.field+" Inhalt:"+JSON.stringify(event.data));
    this.event_column=event.column.field;
    this.event_data=event.data;
    this.editedAnwesenheit.ID_LEHRER=CourseBookComponent.courseBook.idLehrer;
    this.editedAnwesenheit.ID_KLASSE=CourseBookComponent.courseBook.course.id;
    this.editedAnwesenheit.ID_SCHUELER=event.data.id;
    this.editedAnwesenheit.VERMERK=event.data[event.column.field];
    this.editedAnwesenheit.BEMERKUNG=event.data["bem"+event.column.field.substr(2)];
    this.editedAnwesenheit.DATUM=event.column.field.substring(2)+"T00:00:00";
  }
  editCanceled(event) {
    console.log("edit Canceled: row="+event.index+" Column="+event.column.field+" Inhalt:"+JSON.stringify(event.data));
  }

  keyDown(event) {
    console.log("Key Down"+event.which);
    if (event.which === 13 || event.which === 9) {
      this.submitAnwesenheit();
    }
  }

  edit(event) {
    console.log("edit Complete: row=" + event.index + " Column=" + event.column.field + " Inhalt:" + JSON.stringify(event.data));
  }

  submitAnwesenheit() {
    console.log("Sende zum Server =>"+JSON.stringify(this.editedAnwesenheit));
    if (this.editedAnwesenheit.VERMERK=="") {
      console.log("Lösche Anwesenheitseintrag!");
      this.anwesenheitsService.deleteAnwesenheit(this.editedAnwesenheit);
      delete this.event_data[this.event_column];
      delete this.event_data["bem"+this.event_column.substr(2)];
      delete this.event_data["idb"+this.event_column.substr(2)];
      this.dataTable.closeCell();
    }
    else {
      this.anwesenheitsService.setAnwesenheit(this.editedAnwesenheit).subscribe(
        anwesenheit => {
          console.log("Empfange " + JSON.stringify(anwesenheit))
          if (anwesenheit.parseError) {
            this.messageService.add({severity:'error', summary:'Fehler', detail:'Formatierungfehler im Vermerk '+anwesenheit.VERMERK});
          }
          this.event_data[this.event_column]=this.editedAnwesenheit.VERMERK;
          this.event_data["bem"+this.event_column.substr(2)]=this.editedAnwesenheit.BEMERKUNG;
          this.event_data["idkuk"+this.event_column.substr(2)]=this.editedAnwesenheit.ID_LEHRER;
          this.event_data["idb"+this.event_column.substr(2)]=this.editedAnwesenheit.BEMERKUNG;
          this.dataTable.closeCell();
        }
      );
    }
  }

  filterChanged(e) {
    console.log("Filter changed: "+JSON.stringify(e));
    this.dokuService.setDokuFilter(e.filter1,e.filter1);
    this.selectedFilter1=e.filter1;
    this.selectedFilter2=e.filter2;
    this.anwesenheitsService.getTermiondaten(e.filter1.id,e.filter2.id).subscribe(
      data => {
        console.log("Received Terminadaten:"+JSON.stringify(data));
        this.termindaten=data;
        this.applyFilter();
      },
      err => {
        this.messageService.add({severity:'error', summary:'Fehler', detail:'Fehler beim Laden der Termindaten:'+err});
      }
    );
  }

  applyFilter() {
    if (this.termindaten) {
      this.cols = this.colsOrg.filter(elements => {
        if (elements.field.startsWith("id")) {
          for (var i = 0; i < this.termindaten.length; i++) {
            if (elements.field.substr(2) == this.termindaten[i].date.substr(0, this.termindaten[i].date.indexOf("T"))) {
              return true;
            }
          }
          return false;
        }
        else return true;
      });

      console.log("Filtered cols: " + JSON.stringify(this.cols));
    }
  }
}
