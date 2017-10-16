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
import {AnwesenheitsService} from "./services/AnwesenheitsService";
import {Anwesenheit} from "./data/Anwesenheit";
import {MailObject} from "./data/MailObject";
import {CourseSelectComponent} from "./CourseSelectComponent";
import {Pupil} from "./data/Pupil";
import {DokuService} from "./services/DokuService";

/**
 * @title List Verlauf
 */
@Component({
  selector: 'fehlzeiten',
  templateUrl: 'FehlzeitenComponent.html',
  styleUrls: ['FehlzeitenComponent.css']

})
export class FehlzeitenComponent {
  @ViewChild('mailDialog') mailDialog;
  @ViewChild('infoDialog') infoDialog;


  subscription: Subscription;
  anwesenheit:Anwesenheit[];
  KName: string;
  from: Date;
  to: Date;
  public mailObject:MailObject=new MailObject("","","","");


  constructor(private dokuService:DokuService, private anwesenheitsService: AnwesenheitsService, private service: SharedService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.dokuService.setDisplayDoku(true,"Fehlzeiten");
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("List Component Received !" + message.constructor.name);
      this.getAnwesenheit();
    });
    this.getAnwesenheit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAnwesenheit() {
    this.KName = CourseBookComponent.courseBook.course.KNAME;
    this.from = CourseBookComponent.courseBook.fromDate;
    this.to = CourseBookComponent.courseBook.toDate;
    this.anwesenheitsService.getAnwesenheit().subscribe(
      data => {
        this.anwesenheit=<Anwesenheit[]>data;
        console.log("Fehlzeiten empfangen:"+this.anwesenheit.length);
        console.log(JSON.stringify(this.anwesenheit));
        console.log("ID 0 ="+this.anwesenheit[0].id_Schueler);
      },
      err => {
        this.messageService.add({severity:'error', summary:'Fehler', detail:err});
      }
    );
  }

  sendReport(a:Anwesenheit) {
    console.log("Send Bericht!");
    let p:Pupil= CourseSelectComponent.getPupil(a.id_Schueler);
    this.mailDialog.mailService.getTemplate("assets/template.txt",window.location.origin).subscribe(
      data => {
        let template = data;
        this.anwesenheitsService.fillFehlzeitenbericht(template,a,(content,recipient) => {
          console.log("Bericht ="+content);
          this.mailObject = new MailObject(CourseBookComponent.courseBook.email,recipient,"","");
          this.mailObject.content=content;
          this.mailDialog.dialogWidth=800;
          this.mailObject.addCC(CourseBookComponent.courseBook.email);
          this.mailObject.subject="Fehlzeitenbericht für "+p.VNAME+" "+p.NNAME+" vom "+CourseBook.toReadbleString(CourseBookComponent.courseBook.fromDate)+" bis "+CourseBook.toReadbleString(CourseBookComponent.courseBook.toDate);
          this.mailDialog.showDialog("Fehlzeitenbericht für "+p.VNAME+" "+p.NNAME+" vom "+CourseBook.toReadbleString(CourseBookComponent.courseBook.fromDate)+" bis "+CourseBook.toReadbleString(CourseBookComponent.courseBook.toDate));
        });
      },
      err => {
        this.messageService.add({severity:'error', summary:'Fehler', detail: "Failed to load Template!"});
      }
    );

  }

  getPupilName(id:number):string {
    let p:Pupil= CourseSelectComponent.getPupil(id);
    return p.VNAME+" "+p.NNAME;
  }

  infoClick(a:Anwesenheit) {
    console.log("info click:"+JSON.stringify(a));
    let p:Pupil= CourseSelectComponent.getPupil(a.id_Schueler);
    this.infoDialog.showDialog(p);
  }
  mailClick(a:Anwesenheit) {
    console.log("mail click:"+JSON.stringify(a));
    let p:Pupil= CourseSelectComponent.getPupil(a.id_Schueler);
    this.mailObject = new MailObject(CourseBookComponent.courseBook.email,p.EMAIL,"","");
    this.mailDialog.showDialog("Nachricht an "+p.VNAME+" "+p.NNAME);
  }
}
