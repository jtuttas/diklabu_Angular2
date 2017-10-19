import {Component} from "@angular/core";
import {PupilDetailService} from "./services/PupilDetailService";
import {MessageService} from "primeng/components/common/messageservice";
import {PupilDetails} from "./data/PupilDetails";
import {CourseBookComponent} from "./CourseBookComponent";
import {LoginService} from "./services/LoginService";
import {Router} from "@angular/router";
import {Config} from "./data/Config";

@Component({
  selector: 'pupilLogin',
  templateUrl: 'PupilLoginComponent.html',
  styles: ['.left {text-align: left;} .neben {float: left;}']

})

export class PupilLoginComponent {

  public pupilDetails:PupilDetails=new PupilDetails();
  public imgSrc="../assets/anonym.gif";

  constructor (private router: Router, private loginService:LoginService, private pupilDetailService:PupilDetailService,private messageService: MessageService) {

  }

  ngOnInit() {
    this.pupilDetailService.getPupilDetails(+CourseBookComponent.courseBook.ID).subscribe(
      data => {
        this.pupilDetails = data;
        console.log("Eempfange: "+JSON.stringify(data));
      },
      err => {
        console.log("Error Details: +err");
        this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
      });
    this.imgSrc="../assets/anonym.gif";

    this.pupilDetailService.getPupilImage(+CourseBookComponent.courseBook.ID).subscribe(
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

  logout() {
    this.loginService.performLogout(CourseBookComponent.courseBook.username, CourseBookComponent.courseBook.password).subscribe(
      data => {
        delete CourseBookComponent.courseBook.auth_token;
        delete CourseBookComponent.courseBook.username;
        delete CourseBookComponent.courseBook.password;
        delete CourseBookComponent.courseBook.role;
        let link = ['/login'];
        this.router.navigate(link);
      },
      err => {
        console.log("got Error:" + err);
        this.messageService.add({severity: 'error', summary: 'Fehler', detail: 'Logout Fehler!'});
      }
    )
  }
}
