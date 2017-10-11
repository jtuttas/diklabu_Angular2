import {Component} from "@angular/core";
import {LoginService} from "./services/LoginService";
import {decimalDigest} from "@angular/compiler/src/i18n/digest";
import {MessageService} from "primeng/components/common/messageservice";
import {CourseBookComponent} from "./CourseBookComponent";
import {Router} from "@angular/router";
import {Config} from "./data/Config";

@Component({
  selector: 'login',
  styleUrls: ['LoginComponent.css'],
  templateUrl: 'LoginComponent.html',
})
export class LoginComponent {
  username: string="TU";
  password: string="mmbbs";

  constructor(private loginService:LoginService,private messageService: MessageService, private router:Router) {
    if (Config.debug) {
      CourseBookComponent.courseBook.auth_token=1234;
      CourseBookComponent.courseBook.idLehrer="TU";
      CourseBookComponent.courseBook.username="TU";
      CourseBookComponent.courseBook.password="mmbbs";
      CourseBookComponent.courseBook.email="tuttas@mmbbs.de"
      let link = [ '/diklabu'];
      this.router.navigate(link);
    }
  }

  performLogin() {
    console.log("Login with "+this.username+" and PW="+this.password);
      this.loginService.performLogin(this.username,this.password).subscribe(
        data => {console.log("Received from Login: "+JSON.stringify(data));
          CourseBookComponent.courseBook.auth_token=data.auth_token;
          CourseBookComponent.courseBook.idLehrer=data.ID;
          CourseBookComponent.courseBook.username=this.username;
          CourseBookComponent.courseBook.password=this.password;
          CourseBookComponent.courseBook.email=data.email;
          let link = [ '/diklabu'];
          //this.router.navigate(link);
          this.router.navigate(['/diklabu', { outlets: { sub: 'verlauf' } }]);
        },
        err => {console.log("got Error:"+JSON.stringify(err));
          var data = JSON.parse(err);
          this.messageService.add({severity:'error', summary:'Fehler', detail:data.message});

        }


      );
  }
}
