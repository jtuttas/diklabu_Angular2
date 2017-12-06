import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {MessageService} from "primeng/components/common/messageservice";
import {Ausbilder, Betrieb, PupilDetails} from "./data/PupilDetails";
import {PupilDetailService} from "./services/PupilDetailService";
import {Pupil} from "./data/Pupil";
import {PupilImageComponent} from "./PupilImageComponent";
import {DatepickerComponent} from "./DatepickerComponent";
import {CourseBook} from "./data/CourseBook";
import {PupilService} from "./services/PupilService";
import {DokuService} from "./services/DokuService";

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
  @Output() newCompleted = new EventEmitter();

  public display:boolean=false;
  public titel:string="Neuen Schüler anlegen";
  public pupilDetails:PupilDetails=new PupilDetails();
  abgang: boolean =false
  gebDat: Date;
  de: any;

  constructor(private dokuService:DokuService, private pupilDetailService:PupilDetailService,private messageService: MessageService,private pupilService:PupilService) {

  }
  ngOnInit() {
    this.dokuService.setDisplayDoku(false);
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
    this.display = true;
    if (p.id) {
      this.pupilDetails.id=p.id;
      this.titel = p.VNAME + " " + p.NNAME;
      this.pupilDetailService.getPupilDetails(p.id).subscribe(
        data => {
          this.pupilDetails = data;
          if (this.pupilDetails.gebDatum) {

            this.gebDat = new Date(this.pupilDetails.gebDatum);
            this.gebDat.setMinutes(0);
            this.gebDat.setHours(0);
            this.gebDat.setSeconds(0);
            if (!this.pupilDetails.ausbilder) {
              this.pupilDetails.ausbilder = new Ausbilder();
            }
            if (!this.pupilDetails.betrieb) {
              this.pupilDetails.betrieb = new Betrieb();
            }
          }
          else {
            this.gebDat = null;
          }
          if (this.pupilDetails.abgang == "J") {
            this.abgang = true;
          }
          else {
            this.abgang = false;
          }
          this.pimage.getImage(p);
        },
        err => {
          console.log("Error Details: +err");
          this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
        });
    }
    else {
      this.pupilDetails =new PupilDetails();
      this.titel = "Neuen Schüler anlegen.."
      this.gebDat = null;
      this.pupilDetails.id=null;

    }
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
    let pupil:Pupil = new Pupil();
    pupil.id=this.pupilDetails.id;
    if (this.pupilDetails.vorname) {
      pupil.VNAME=this.pupilDetails.vorname;
    }
    else {
      this.messageService.add({severity: 'warning', summary: 'Warnung', detail: "Der Schüler muss einen Vornamen haben!"});
      return;
    }
    if (this.pupilDetails.name) {
      pupil.NNAME=this.pupilDetails.name;
    }
    else {
      this.messageService.add({severity: 'warning', summary: 'Warnung', detail: "Der Schüler muss einen Nachnamen haben!"});
      return;
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
    else {
      this.messageService.add({severity: 'warning', summary: 'Warnung', detail: "Der Schüler muss ein Geburtsdatum haben!"});
      return;
    }
    this.display=false;
    if (pupil.id) {
      this.pupilService.setPupil(pupil).subscribe(
        data => {
          console.log("Received: " + JSON.stringify(data));
          this.editCompleted.emit(pupil);
        },
        err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler beim Ändern der Daten von ' + pupil.VNAME + ' ' + pupil.NNAME + ':' + err
          });
        }
      );
    }
    else {
      this.pupilService.newPupil(pupil).subscribe(
        data => {
          console.log("New Pupil Received: " + JSON.stringify(data));
          this.newCompleted.emit(data);
          this.messageService.add({severity: 'info', summary: 'Information', detail: "Neuen Schüler "+pupil.VNAME+" "+pupil.NNAME+" angelegt!"});
        },
        err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler beim hinzufügen von ' + pupil.VNAME + ' ' + pupil.NNAME + ':' + err
          });
        }
      );
    }
  }
}
