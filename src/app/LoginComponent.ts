import {Component} from "@angular/core";
import {LoginService} from "./services/LoginService";
import {decimalDigest} from "@angular/compiler/src/i18n/digest";
import {MessageService} from "primeng/components/common/messageservice";
import {CourseBookComponent} from "./CourseBookComponent";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  styleUrls: ['LoginComponent.css'],
  templateUrl: 'LoginComponent.html',
})
export class LoginComponent {
  username: string="tuttas";
  password: string="mmbbs";

  constructor(private loginService:LoginService,private messageService: MessageService, private router:Router) {}

  performLogin() {
    console.log("Login with "+this.username+" and PW="+this.password);
      this.loginService.performLogin(this.username,this.password).subscribe(
        data => {console.log("Received from Login: "+JSON.stringify(data));
          CourseBookComponent.courseBook.auth_token=data.auth_token;
          CourseBookComponent.courseBook.idLehrer=data.ID;
          CourseBookComponent.courseBook.username=this.username;
          CourseBookComponent.courseBook.password=this.password;
          let link = [ '/diklabu'];
          this.router.navigate(link);
        },
        err => {console.log("got Error:"+JSON.stringify(err));
          var data = JSON.parse(err);
          this.messageService.add({severity:'error', summary:'Fehler', detail:data.message});

        }


      );
  }
}
