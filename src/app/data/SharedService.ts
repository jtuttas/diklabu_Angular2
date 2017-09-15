import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {CourseBook} from "./CourseBook";
import {Observable} from "rxjs";

@Injectable()
export class SharedService {

  private subject = new Subject<CourseBook>();

  courseBookChanged(message: CourseBook) {
    this.subject.next(message);
  }


  getCoursebook(): Observable<any> {
    return this.subject.asObservable();
  }
}
