import {Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';

import {CourseBook} from "./data/CourseBook";
import {Subscription} from "rxjs/Subscription";
import {SharedService} from "./services/SharedService";

import {MessageService} from "primeng/components/common/messageservice";

import {PupilDetailService} from "./services/PupilDetailService";
import {AnwesenheitsService} from "./services/AnwesenheitsService";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

  providers: [MessageService]
})

export class AppComponent implements OnDestroy{

  public msgs;
  subscription: Subscription;
  courseBook:CourseBook;


  @ViewChild('courseBookComponent') courseBookComponent;
  @ViewChild('tabcomponent') tabComponent;


  constructor(private service: SharedService, private pupilDetailService:PupilDetailService, private messageService: MessageService) {
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


}
