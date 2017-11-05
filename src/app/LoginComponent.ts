import {Component} from "@angular/core";
import {LoginService} from "./services/LoginService";
import {decimalDigest} from "@angular/compiler/src/i18n/digest";
import {MessageService} from "primeng/components/common/messageservice";
import {CourseBookComponent} from "./CourseBookComponent";
import {Router} from "@angular/router";
import {Config} from "./data/Config";

declare var VERSION: any ;
declare var TWOFA: boolean ;

@Component({
  selector: 'login',
  styleUrls: ['LoginComponent.css'],
  templateUrl: 'LoginComponent.html',
})
export class LoginComponent {
  username: string="";
  password: string="";
  version: string=Config.version
  serverVersion: string="";
  twoFA: boolean=false;
  phase:number=0;
  pin:number;
  uid:string;

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
    this.addJsToElement(Config.SERVER+"/Diklabu/ClientConfig").onload = () => {
      console.log('ClientConfig Tag loaded');
      this.serverVersion=VERSION;
      this.twoFA=TWOFA;
    }

  }

  addJsToElement(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
  }

  sendPin() {
    this.loginService.setPin(this.pin,this.uid).subscribe(
      data => {
        console.log("Received from Login2: "+JSON.stringify(data));
        if (data.success) {
          CourseBookComponent.courseBook.auth_token = data.auth_token;
          CourseBookComponent.courseBook.idLehrer = data.ID;
          CourseBookComponent.courseBook.username = this.username;
          CourseBookComponent.courseBook.password = this.password;
          CourseBookComponent.courseBook.email = data.email;
          CourseBookComponent.courseBook.role = data.role;
          CourseBookComponent.courseBook.ID = data.ID;
          if (data.role=="Schueler") {
            this.router.navigate(['/schueler']);
          }
          else {
            this.router.navigate(['/diklabu', { outlets: { sub: 'verlauf' } }]);
          }
        }
        else {
          this.messageService.add({severity:'error', summary:'Fehler', detail:data.msg});
          this.phase=0;
          delete this.pin;
        }
      },
      err => {
        this.messageService.add({severity:'error', summary:'Fehler', detail:err});
      }
    );
  }

  performLogin() {
    console.log("Login with "+this.username+" and PW="+this.password);
      this.loginService.performLogin(this.username,this.password).subscribe(
        data => {console.log("Received from Login: "+JSON.stringify(data));

          if (this.twoFA && data.role!="Schueler") {
            if (data.success) {
              this.messageService.add({severity: 'info', summary: 'Info', detail: data.msg});
              this.uid = data.uid;
              this.phase = 1;
            }
            else {
              this.messageService.add({severity: 'warning', summary: 'Warnung', detail: data.msg});
            }
          }
          else {
            CourseBookComponent.courseBook.auth_token = data.auth_token;
            CourseBookComponent.courseBook.idLehrer = data.ID;
            CourseBookComponent.courseBook.username = this.username;
            CourseBookComponent.courseBook.password = this.password;
            CourseBookComponent.courseBook.email = data.email;
            CourseBookComponent.courseBook.role = data.role;
            CourseBookComponent.courseBook.ID = data.ID;
            if (data.role=="Schueler") {
              this.router.navigate(['/schueler']);
            }
            else {
              this.router.navigate(['/diklabu', { outlets: { sub: 'verlauf' } }]);
            }
          }
        },
        err => {console.log("got Error:"+JSON.stringify(err));
          var data = JSON.parse(err);
          this.messageService.add({severity:'error', summary:'Fehler', detail:data.message});

        }


      );
  }
}
