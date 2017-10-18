import {Component, ViewChild} from "@angular/core";
import {SharedService} from "./services/SharedService";
import {MessageService} from "primeng/components/common/messageservice";
import {Subscription} from "rxjs/Subscription";
import {Betrieb} from "./data/Betrieb";
import {CourseService} from "./services/CourseService";
import {CourseBookComponent} from "./CourseBookComponent";
import {Pupil} from "./data/Pupil";
import {CourseSelectComponent} from "./CourseSelectComponent";
import {MailObject} from "./data/MailObject";
import {DokuService} from "./services/DokuService";

@Component({
  selector: 'betriebe',
  styles: ['.links {text-align: left;} img {cursor: pointer;}'],
  templateUrl: 'BetriebeComponent.html'
})
export class BetriebeComponent {
  @ViewChild('mailDialog') mailDialog;
  @ViewChild('infoDialog') infoDialog;
  subscription: Subscription;
  betriebe:Betrieb[];
  KName:string;
  public mailObject:MailObject=new MailObject("","","","");

  constructor(private dokuService:DokuService, private courseService:CourseService, private service: SharedService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.dokuService.setDisplayDoku(true,"Betriebe");
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("List Component Received !" + message.constructor.name);
      this.getBetriebe();
    });
    this.getBetriebe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBetriebe() {
    this.KName=CourseBookComponent.courseBook.course.KNAME;
    this.betriebe=[];
    this.courseService.getCompanies(CourseBookComponent.courseBook.course.KNAME).subscribe(
      data => {
        this.betriebe=data;
        console.log("Betriebsliste: "+JSON.stringify(data));
      },
      err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Kann Liste der Betriebe nicht laden: ' + err
        });
      }
    );
  }

  getName(id:number) {
    let p:Pupil=CourseSelectComponent.getPupil(id);
    return p.VNAME+" "+p.NNAME;
  }

  getInfo(id:number) {
    let p:Pupil=CourseSelectComponent.getPupil(id);
    return p.INFO;
  }
  mailClick(id:number) {
    let p:Pupil=CourseSelectComponent.getPupil(id);
    console.log("0Mail click! on "+JSON.stringify(p));
    this.mailObject = new MailObject(CourseBookComponent.courseBook.email,p.EMAIL,"","");
    this.mailDialog.showDialog("Nachricht an "+p.VNAME+" "+p.NNAME);
  }

  mailClickBetrieb(b:Betrieb) {
    console.log("0Mail Betrieb click! on "+JSON.stringify(b));
    this.mailObject = new MailObject(CourseBookComponent.courseBook.email,b.email,"","");
    this.mailDialog.showDialog("Nachricht an "+b.nName);
  }

  infoClick(id:number) {
    let p:Pupil=CourseSelectComponent.getPupil(id);
    console.log("Info click! on "+JSON.stringify(p));
    this.infoDialog.showDialog(p);
  }


}
