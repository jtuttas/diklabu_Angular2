import {Component} from "@angular/core";
import {LoginService} from "./services/LoginService";
import {CourseBookComponent} from "./CourseBookComponent";
import {Router} from "@angular/router";
import {MessageService} from "primeng/components/common/messageservice";

@Component({
  selector: 'logout',
  styles: ['img {' +
  'cursor: pointer;' +
  'position: absolute;' +
  'top: 5px;' +
  'right: 5px;' +
  '}'],
  template:
    '<img (click)="performLogout()" src="../assets/logout.png" pTooltip="abmelden" tooltipPosition="left"/>'
})

export class logoutComponent {

  constructor(private loginService: LoginService, private router: Router, private messageService: MessageService,) {

  }

  performLogout() {
    this.loginService.performLogout(CourseBookComponent.courseBook.username, CourseBookComponent.courseBook.password).subscribe(
      data => {
        delete CourseBookComponent.courseBook.auth_token;
        delete CourseBookComponent.courseBook.username;
        delete CourseBookComponent.courseBook.password;
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
