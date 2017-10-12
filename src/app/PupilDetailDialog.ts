import {Component, Input, ViewChild} from "@angular/core";
import {MessageService} from "primeng/components/common/messageservice";
import {PupilDetails} from "./data/PupilDetails";
import {PupilDetailService} from "./services/PupilDetailService";
import {Pupil} from "./data/Pupil";
import {PupilImageComponent} from "./PupilImageComponent";

@Component({
  selector: 'pupildetails',
  styles: ['input {' +
  'width:100%;'+
  '}'+
  'textarea{width:100%;}'

  ],
  templateUrl: './PupilDetailDialog.html',
})
export class PupilDetailDialog {
  @ViewChild('pimage') pimage:PupilImageComponent;

  public display:boolean=false;
  public titel:string="";
  public pupilDetails:PupilDetails=new PupilDetails();

  constructor(private pupilDetailService:PupilDetailService,private messageService: MessageService) {
  }

  showDialog(p:Pupil) {
    this.pimage.getImage(p);
    this.titel = p.VNAME + " " + p.NNAME;
    this.display = true;
    this.pupilDetailService.getPupilDetails(p.id).subscribe(
      data => {
        this.pupilDetails = data;
      },
      err => {
        console.log("Error Details: +err");
        this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
      });
  }

  updateBem() {
    this.display=false;
    this.pupilDetailService.setInfo(this.pupilDetails.id,this.pupilDetails.info).subscribe(
      data => {
        console.log ("Recieved:"+JSON.stringify(data));
      },
      err => {
        console.log ("ERR Recieved:"+JSON.stringify(err));
      }
    );
  }
}
