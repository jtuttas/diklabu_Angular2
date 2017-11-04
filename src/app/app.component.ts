import {Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';

import {CourseBook} from "./data/CourseBook";
import {Subscription} from "rxjs/Subscription";
import {SharedService} from "./services/SharedService";

import {MessageService} from "primeng/components/common/messageservice";

import {PupilDetailService} from "./services/PupilDetailService";
import {AnwesenheitsService} from "./services/AnwesenheitsService";
import {Config} from "./data/Config";



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

  }



  ngOnDestroy() {

  }


}
