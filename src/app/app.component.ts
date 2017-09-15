import {Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {CourseBook} from "./data/CourseBook";
import {ComponentChangedListener} from "./data/ComponentChangedListener";
import {Subscription} from "rxjs/Subscription";
import {SharedService} from "./SharedService";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],


})

export class AppComponent implements ComponentChangedListener, OnDestroy{
  static toastr :ToastsManager;
  subscription: Subscription;
  courseBook:CourseBook;
  message:any;

  static postWarning(msg: string, titel: string): void {
    this.toastr.warning(msg, titel);
  }

  static postError(msg: string, titel: string): void {
    this.toastr.error(msg, titel);
  }

  static postInfo(msg: string, titel: string): void {
    this.toastr.info(msg, titel);
  }

  public static SERVER="http://localhost:8080/";

  @ViewChild('courseBookComponent') courseBookComponent;
  @ViewChild('tabcomponent') tabComponent;


  constructor(t: ToastsManager, vcr: ViewContainerRef,private service: SharedService) {
    AppComponent.toastr=t;
    AppComponent.toastr.setRootViewContainerRef(vcr);
    this.subscription = this.service.getCoursebook().subscribe(message => {
      this.courseBook=message;
      console.log("App Component Received !"+message.constructor.name);
      this.courseBook.toString();
    });
  }


  componentChanged(c:any): void {
    console.log ("App Component changed");
    //this.tabComponent.updateView();
  }

  componentInit(c:any){
    console.log ("------> App Component init:"+this.tabComponent);
    if (c==this.tabComponent) {
      console.log("is TabCompuneten");
      this.tabComponent.updateView();
    }
    else {
      console.log("is CourseBookComonent");
      this.tabComponent.listVerlaufComponent.getVerlauf();
    }
  }

  ngOnInit() {
    console.log("app Component ngInit!"+this.tabComponent);

  }

  ngAfterViewInit() {
    console.log("app Child Component Init!"+this.tabComponent);
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
