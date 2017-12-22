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
import {Portfolio, PortfolioEintrag} from "./data/Portfolio";
import {Anwesenheit} from "./data/Anwesenheit";
import {MailObject} from "./data/MailObject";
import {Config} from "./data/Config";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'portfolio',
  templateUrl: './PortfolioComponent.html',
  styles: ['.links {text-align: left;}.select {cursor: pointer;}']
})

export class PortfolioComponent {
  @ViewChild('mailDialog') mailDialog;
  @ViewChild('infoDialog') infoDialog;
  public mailObject:MailObject=new MailObject("","","","");
  coursePortfolio: Portfolio[];
  subscription: Subscription;
  KName:string;

  constructor(private pupilService:PupilService, private dokuService:DokuService, private service:SharedService,private messageService: MessageService,public courseService:CourseService) {
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("LehrerzugehoerigkeitComponent Component Model Changed !"+message.constructor.name);
      this.update();
    });
  }

  public  downloadPortfolio(p:Pupil) {
    console.log("Cretae Portfolio for "+p.id);
    this.pupilService.downloadPortfolio(p.id).subscribe(blob => {
      console.log("Download Portfolio reveived BLOB");
      FileSaver.saveAs(blob, "Portfolio_"+p.VNAME+"_"+p.NNAME+".pdf");
      }
    )
  }


  private update() {
    this.KName=CourseBookComponent.courseBook.course.KNAME;
    this.coursePortfolio = new Array();
    this.courseService.getPortfolio(CourseBookComponent.courseBook.course.id).subscribe(
      data => {
        console.log(" Receive Portolio: "+JSON.stringify(data));
        this.coursePortfolio=data;
      },
      err => {
        this.messageService.add({severity:'error', summary:'Fehler', detail:'Kann Portfolio der Klasse '+CourseBookComponent.courseBook.course.KNAME+' nicht laden: '+err});
      }
    );
  }

  getPortfolioList(p:Portfolio) {
    console.log("getPortfolioList von "+JSON.stringify(p));
    let e :PortfolioEintrag[] = p.eintraege;
    var out="";
    for (var i=0;i<e.length;i++) {
      out=out+e[i].KName+" ("+e[i].wert+")  ";
    }
    return out;
  }

  ngOnInit() {
    this.dokuService.setDisplayDoku(true,"Portfolio");
    this.update();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  getPupil(pid:number):Pupil {
    console.log("Suche Schüler mit der ID="+pid);
    return CourseSelectComponent.getPupil(pid);
  }

  infoClick(pid:number) {
    console.log("info click: ID="+pid);
    let p:Pupil= CourseSelectComponent.getPupil(pid);
    this.infoDialog.showDialog(p);
  }
  mailClick(pid:number) {
    console.log("mail click: ID="+pid);
    let p:Pupil= CourseSelectComponent.getPupil(pid);
    this.mailObject = new MailObject(CourseBookComponent.courseBook.email,p.EMAIL,"","");
    this.mailDialog.showDialog("Nachricht an "+p.VNAME+" "+p.NNAME);
  }

}
