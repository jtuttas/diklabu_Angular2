import {Component, Input} from "@angular/core";
import {MenuItem} from "primeng/primeng";
import {CourseBookComponent} from "./CourseBookComponent";
import {LoginService} from "./services/LoginService";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/components/common/messageservice";

@Component({
  selector: 'menu',
  styles: ['.my {text-align: left;}'+
  '.topleft { position: absolute; left:4px;top:4px;'],
  template: '<div class="topleft"><p-tieredMenu #menu popup="popup" [model]="items" class="my"></p-tieredMenu>\n' +
  '<button type="button" pButton icon="fa fa-list" label="Menu" (click)="menu.toggle($event)"></button></div>'
})
export class MenuComponent {

  items: MenuItem[];

  constructor(private loginService: LoginService, private router: Router, private messageService: MessageService,private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.items = [
      {label: 'Verlauf', icon: 'fa-flash', command: event2 => this.showVerlauf(event2)},
      {label: 'Anwesenheit', icon: 'fa-check',
        items: [
          {label: 'Übersicht', icon: 'fa-table', command: event2 => this.showAnwesenheit(event2)},
          {label: 'heute', icon: 'fa-user-plus',command: event2 => this.showTodayAnwesenheit(event2)}
        ]
      },
      {label: 'Logout', icon: 'fa-times', command: event2 => this.logout(event2)}
    ];
  }

  showVerlauf(e) {
    console.log("show Verlauf");
    this.router.navigate(['/diklabu', { outlets: { sub: 'verlauf' } }]);
  }
  showAnwesenheit(e) {
    console.log("show Anwesenheit");
    this.router.navigate(['/diklabu', { outlets: { sub: 'anwesenheit' } }]);
  }
  showTodayAnwesenheit(e) {
    console.log("show Today Anwesenheit");
    this.router.navigate(['/diklabu', { outlets: { sub: 'todayanwesenheit' } }]);
  }

  logout(e) {
    console.log("logout");
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
