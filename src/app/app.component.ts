import {Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';

import {CourseBook} from "./data/CourseBook";
import {Subscription} from "rxjs/Subscription";
import {SharedService} from "./services/SharedService";

import {MessageService} from "primeng/components/common/messageservice";
import {MailService} from "./services/MailService";
import {MailObject} from "./data/MailObject";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

  providers: [MessageService]
})

export class AppComponent implements OnDestroy{


  subscription: Subscription;
  courseBook:CourseBook;

  public static SERVER="http://localhost:8080/";

  @ViewChild('courseBookComponent') courseBookComponent;
  @ViewChild('tabcomponent') tabComponent;


  constructor(private service: SharedService, private mailService:MailService, private messageService: MessageService) {
    this.subscription = this.service.getCoursebook().subscribe(message => {
      this.courseBook=message;
      console.log("App Component Received !"+message.constructor.name);
      this.courseBook.toString();
    });
  }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    console.log("ngOnDestroy()");
    this.subscription.unsubscribe();
  }

  testClick() {
    this.courseBook.toString();
    let m:MailObject;
    m=new MailObject("tuttas@mmbbs.de","tuttas68@gmail.com","From Mail Service34","from Mail Service");
    this.mailService.sendMail(m).subscribe(answer => {
      console.log("Answer from Mailservice:"+JSON.stringify(answer));
      if (answer.success==false) {
        this.messageService.add({severity:'error', summary:'Fehler', detail: answer.msg});
      }
      else {
        this.messageService.add({severity:'info', summary:'Info', detail:'Mail erfolgreich versandt!'});
      }

    },
      err => {
        console.log("Error from Mailservice:"+err);
      });
  }


}
