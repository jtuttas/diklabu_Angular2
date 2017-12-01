import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {MessageService} from "primeng/components/common/messageservice";
import {PupilDetails} from "./data/PupilDetails";
import {PupilDetailService} from "./services/PupilDetailService";
import {Pupil} from "./data/Pupil";
import {PupilImageComponent} from "./PupilImageComponent";
import {DatepickerComponent} from "./DatepickerComponent";
import {CourseBook} from "./data/CourseBook";
import {PupilService} from "./services/PupilService";

@Component({
  selector: 'pupileditdetails',
  styles: ['input {' +
  'width:100%;'+
  '}'+
  'textarea{width:100%;}'

  ],
  templateUrl: './PupilDetailEditDialog.html',
})
export class PupilDetailEditDialog {
  @ViewChild('pimage') pimage:PupilImageComponent;
  @Output() editCompleted = new EventEmitter();

  public display:boolean=false;
  public titel:string="";
  public pupilDetails:PupilDetails=new PupilDetails();
  abgang: boolean =false
  gebDat: Date;
  de: any;

  constructor(private pupilDetailService:PupilDetailService,private messageService: MessageService,private pupilService:PupilService) {

  }
  ngOnInit() {

    this.de = {
      firstDayOfWeek: 1,
      dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnestag", "Freitag", "Samstag"],
      dayNamesShort: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
      dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
      today: 'Heute',
      clear: 'löschen'
    };
  }
  showDialog(p:Pupil) {
    this.pimage.getImage(p);
    this.titel = p.VNAME + " " + p.NNAME;
    this.display = true;
    this.pupilDetailService.getPupilDetails(p.id).subscribe(
      data => {
        this.pupilDetails = data;
        if (this.pupilDetails.gebDatum) {

        this.gebDat = new Date(this.pupilDetails.gebDatum);
        this.gebDat.setMinutes(0);
        this.gebDat.setHours(0);
        this.gebDat.setSeconds(0);
      }
      else {
          this.gebDat=null;
        }
        if (this.pupilDetails.abgang=="J") {
          this.abgang=true;
        }
        else {
          this.abgang=false;
        }
      },
      err => {
        console.log("Error Details: +err");
        this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
      });
  }

  updateBem() {
    this.pupilDetailService.setInfo(this.pupilDetails.id,this.pupilDetails.info).subscribe(
      data => {
        console.log ("Recieved:"+JSON.stringify(data));
      },
      err => {
        console.log ("ERR Recieved:"+JSON.stringify(err));
      }
    );
  }

  setPupil() {
    this.display=false;
    let pupil:Pupil = new Pupil();
    pupil.id=this.pupilDetails.id;
    if (this.pupilDetails.vorname) {
      pupil.VNAME=this.pupilDetails.vorname;
    }
    if (this.pupilDetails.name) {
      pupil.NNAME=this.pupilDetails.name;
    }
    if (this.pupilDetails.email) {
      pupil.EMAIL=this.pupilDetails.email;
    }
    if (this.abgang) {
      pupil.ABGANG="J";
    }
    else {
      pupil.ABGANG="N";
    }
    if (this.gebDat) {
      pupil.GEBDAT=this.gebDat;
      console.log("Eingestellt ist "+this.gebDat);
    }
    this.pupilService.setPupil(pupil).subscribe(
      data => {
        console.log("Received: "+JSON.stringify(data));
        this.editCompleted.emit(pupil);
      },
      err => {
        this.messageService.add({severity: 'error', summary: 'Fehler beim Ändern der Daten von '+pupil.VNAME+' '+pupil.NNAME+':'+ err});
      }
    );
  }
}
