import {Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';

import {CourseBook} from "./data/CourseBook";
import {Subscription} from "rxjs/Subscription";
import {SharedService} from "./services/SharedService";

import {MessageService} from "primeng/components/common/messageservice";



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


  constructor(private service: SharedService) {
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
  }


}
