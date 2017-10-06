import {Component} from "@angular/core";
import {MessageService} from "primeng/components/common/messageservice";
import {PupilDetailService} from "./services/PupilDetailService";
import {Pupil} from "./data/Pupil";
import {CourseBookComponent} from "./CourseBookComponent";
import {AppComponent} from "./app.component";

@Component({
  selector: 'pupilimage',
  styles: ['#adapt {' +
    'text-align: center;'+
    'padding: 5px;'+
  '}'  ],
  template: ' <img width="200" alt="Pupil Image" [src]="imgSrc">'+
    '<div id="adapt">'+
  '<p-fileUpload  name="file"  mode="basic" accept="image/*" (onUpload)="onBasicUpload($event)" [url]="uploadUrl"></p-fileUpload>'+
    '</div>'
  ,
})
export class PupilImageComponent {

  public imgSrc="../assets/anonym.gif";
  public uploadUrl:string = AppComponent.SERVER+"/Diklabu/api/v1/schueler/bild/";
  private currentPupil:Pupil;

  constructor(private pupilDetailService:PupilDetailService,private messageService: MessageService) {
  }

  getImage(p:Pupil) {
    this.currentPupil=p;
    this.imgSrc="../assets/anonym.gif";
    this.uploadUrl=AppComponent.SERVER+"/Diklabu/api/v1/schueler/bild/"+p.id;
    this.pupilDetailService.getPupilImage(p.id).subscribe(
      data => {
      if (data) {
        console.log("Bild vorhanden");
        let base64:string=data.base64;
        var patt = /(?:\r\n|\r|\n)/g;
        base64 = base64.replace(patt,"");
        this.imgSrc="data:image/png;base64,"+base64;

      }
      },
      err => {console.log("Error Image: +err");
        this.messageService.add({severity:'error', summary:'Fehler', detail: err});
      });
  }

  onBasicUpload(e) {
    console.log("onBaiscUpload:"+JSON.stringify(e));
    this.getImage(this.currentPupil);
  }
}
