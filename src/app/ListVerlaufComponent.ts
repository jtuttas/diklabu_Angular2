import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {Verlauf} from "./data/Verlauf";
import {HttpErrorResponse} from "@angular/common/http";
import {AppComponent} from "./app.component";
import {CourseBook} from "./data/CourseBook";

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {CourseBookComponent} from "./CourseBookComponent";
import {SharedService} from "./services/SharedService";
import {Subscription} from "rxjs/Subscription";
import {MessageService} from "primeng/components/common/messageservice";
import {Headers} from '@angular/http';
import {VerlaufsService} from "./services/VerlaufsService";
import {Config} from "./data/Config";

/**
 * @title List Verlauf
 */
@Component({
  selector: 'listverlauf',
  styleUrls: ['ListVerlaufComponent.css'],
  templateUrl: 'ListVerlaufComponent.html',
})
export class ListVerlaufComponent {
  @Output() editVerlauf = new EventEmitter();
  @ViewChild('deleteDialog') deleteDialog;

  filter: string = "";
  subscription: Subscription;
  compDisabled = true;
  selectedVerlauf: Verlauf;
  selectedIndex: number;
  verlauf: Verlauf[];
  orgVerlauf: Verlauf[];

  IDLehrer: string;
  KName: string;
  from: Date;
  to: Date;


  constructor(private verlaufsService: VerlaufsService, private service: SharedService, private messageService: MessageService) {
    this.IDLehrer = CourseBookComponent.courseBook.idLehrer;
  }

  ngOnInit() {
    console.log("!!!!List Verlauf Component ngInit CourseBook=" + CourseBookComponent.courseBook)
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("List Component Received !" + message.constructor.name);
      this.getVerlauf();
    });
    this.getVerlauf();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    console.log("!!!!List Verlauf Component ngAfterInit CourseBook=" + CourseBookComponent.courseBook)
  }


  filterChanged() {
    console.log("Filter Changed! (" + this.filter + ")");
    if (this.filter.length == 0) {
      this.verlauf = this.orgVerlauf;
    }
    else {
      this.verlauf = this.orgVerlauf.filter(obj => {
        let a: string = obj.ID_LEHRER + obj.ID_LERNFELD + obj.wochentag + obj.INHALT + obj.AUFGABE + obj.BEMERKUNG;
        return a.match(this.filter);
      });
    }
  }

  public getVerlauf(): void {
    this.KName = CourseBookComponent.courseBook.course.KNAME;
    this.from = CourseBookComponent.courseBook.fromDate;
    this.to = CourseBookComponent.courseBook.toDate;
    // Make the HTTP request:
    console.log("URL=" + Config.SERVER + "/Diklabu/api/v1/verlauf/" + CourseBookComponent.courseBook.course.KNAME + "/" + CourseBook.toSQLString(CourseBookComponent.courseBook.fromDate) + "/" + CourseBook.toSQLString(CourseBookComponent.courseBook.toDate));
    var headers = new Headers();
    headers.append("auth_token", "" + CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type", "application/json;  charset=UTF-8");

    this.verlaufsService.getVerlauf().subscribe(data => {
        console.log("Verlauf=" + JSON.stringify(data));
        this.verlauf = data;
        this.orgVerlauf = data;
      },
      err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Kann Verlauf nicht vom Server laden! MSG=' + err
        });
      });
  }


  addVerlauf(v: Verlauf): void {
    console.log("Suche EIntrag!" + JSON.stringify(v));
    for (var i = 0; i < this.orgVerlauf.length; i++) {
      console.log("Vergleich " + JSON.stringify(this.orgVerlauf[i]));
      if (this.orgVerlauf[i].ID_LEHRER === v.ID_LEHRER && this.orgVerlauf[i].STUNDE === v.STUNDE && this.orgVerlauf[i].DATUM === v.DATUM) {
      //if (this.orgVerlauf[i].ID === v.ID) {
        console.log("EIntrag! gefunden (wird aktualisiert!) ID=" + v.ID)
        this.orgVerlauf[i].INHALT = v.INHALT;
        this.orgVerlauf[i].BEMERKUNG = v.BEMERKUNG;
        this.orgVerlauf[i].AUFGABE = v.AUFGABE;
        this.orgVerlauf[i].ID_LERNFELD = v.ID_LERNFELD;
        this.orgVerlauf[i].ID = v.ID;
        this.filterChanged();
        return ;
      }
    }
    console.log(" Neuer Einrag wird eingefügt");
    this.orgVerlauf.push(v);
    console.log("Pushed " + JSON.stringify(v));
    this.orgVerlauf = this.orgVerlauf.sort((v1: Verlauf, v2: Verlauf) => {
      console.log("Sortierung!");
      if (v1.DATUM > v2.DATUM) {
        return 1;
      }
      if (v1.DATUM < v2.DATUM) {
        return -1;
      }
      var std1 = +v1.STUNDE;
      var std2 = +v2.STUNDE;
      if (std1 > std2) {
        return 1
      }
      ;
      if (std1 < std2) {
        return -1
      }
      ;
      return 0;
    });
    this.filterChanged();

  }


  delete(v: Verlauf, index: number) {
    console.log("Delete Verlauf index=" + index + " Modell=" + JSON.stringify(v));
    this.deleteDialog.showDialog("Verlaufseintrag löschen?", v);
  }

  confirmDelete(v: Verlauf) {
    this.verlaufsService.deleteVerlauf(v).subscribe(data => {
        console.log("Delete Verlauf=" + JSON.stringify(data));
        this.orgVerlauf = this.orgVerlauf.filter(obj => obj.ID !== v.ID);
        this.filterChanged();
      },

      (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Kann Verlaufselement nicht löschen! MSG=' + err.error.message
        });
      });
  }


  edit(v: Verlauf, index: number) {
    this.selectedVerlauf = v;
    this.selectedIndex = index;
    console.log("edit index=" + index + " Element=" + JSON.stringify(v));
    this.editVerlauf.emit(v);
  }
}
