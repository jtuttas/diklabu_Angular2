import { Injectable }              from '@angular/core';
import { Http, Response, Headers }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AppComponent} from "../app.component";
import {CourseBookComponent} from "../CourseBookComponent";
import {Pupil} from "../data/Pupil";
import {Company} from "../data/Company";
import {Config} from "../data/Config";
import {HttpService} from "../loader/HttpService";
import {Anwesenheitseintrag} from "../data/Anwesenheitseintrag";
import {Course} from "../data/Course";
import {CourseBook} from "../data/CourseBook";
import {Teacher} from "../data/Teacher";

@Injectable()
export class TeacherService {

  private url;
  constructor (private http: HttpService) {}

  getTeachers(): Observable<Teacher[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/lehrer/";  // URL to web API
    console.log("get Teacher URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCoursesOfTeacher(tid:String): Observable<Course[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/klasse/klassenlehrer/"+tid;  // URL to web API
    console.log("get Teacher URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }


  getTeachersOfCourse(course:Course): Observable<Teacher[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/klasse/lehrer/"+course.id;  // URL to web API
    console.log("get Teacher URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  addTeacherToCourse(teacher:Teacher,course:Course) {
    console.log("Add Teacher: "+JSON.stringify(teacher)+ " to course "+JSON.stringify(course));
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/klasse/verwaltung/lehrer/add/";  // URL to web API
    console.log("URL="+this.url);
    var body = {ID_LEHRER: teacher.id, ID_KLASSE:course.id};
    return this.http.post(this.url,body,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  removeTeacherFromCourse(teacher:Teacher,course:Course) {
    console.log("Remove Teacher: "+JSON.stringify(teacher)+ " to course "+JSON.stringify(course));
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/klasse/verwaltung/lehrer/"+teacher.id+"/"+course.id;  // URL to web API
    console.log("URL="+this.url);
    return this.http.delete(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    console.log("URL="+this.url);
    console.log("Receive Pupils: "+JSON.stringify(res.json()));
    let body = res.json();
    return body;
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
