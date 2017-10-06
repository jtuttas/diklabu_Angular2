import {Component, Input} from "@angular/core";
import {MessageService} from "primeng/components/common/messageservice";
import {PupilDetails} from "./data/PupilDetails";
import {PupilDetailService} from "./services/PupilDetailService";
import {Pupil} from "./data/Pupil";

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

  public display:boolean=false;
  public titel:string="";
  public pupilDetails:PupilDetails=new PupilDetails();

  constructor(private pupilDetailService:PupilDetailService,private messageService: MessageService) {
  }

  showDialog(p:Pupil) {
    this.titel=p.VNAME+" "+p.NNAME;
    this.display = true;
    this.pupilDetailService.getPupilDetails(p.id).subscribe(
      data => {console.log("Received Details:"+JSON.stringify(data));
        this.pupilDetails=data;},
      err => {console.log("Error Details: +err");
        this.messageService.add({severity:'error', summary:'Fehler', detail: err});
      });
  }
}
