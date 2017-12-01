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

@Injectable()
export class PupilService {

  private url;
  constructor (private http: HttpService) {}

  getPupils(id:number): Observable<Pupil[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/klasse/member/"+id;  // URL to web API
    console.log("get pupils URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllPupils(): Observable<Pupil[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/schueler/";  // URL to web API
    console.log("get pupils URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanies(kname:string): Observable<Company[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/klasse/betriebe/"+kname;  // URL to web API
    console.log("get companies URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  setPupil(pupil:Pupil) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/schueler/verwaltung/"+pupil.id;  // URL to web API
    console.log("URL="+this.url);
    var header;
    if (pupil.GEBDAT) {
      header = {
        ABGANG: pupil.ABGANG,
        EMAIL: pupil.EMAIL,
        NNAME: pupil.NNAME,
        VNAME: pupil.VNAME,
        GEBDAT: CourseBook.toSQLString(pupil.GEBDAT)
      };
    }
    else {
      header = {
        ABGANG: pupil.ABGANG,
        EMAIL: pupil.EMAIL,
        NNAME: pupil.NNAME,
        VNAME: pupil.VNAME,
      }
    }
    console.log("Sende zum Server: "+JSON.stringify(header));
    return this.http.post(this.url,header,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  addPupilToCourse(pupil:Pupil,course:Course) {
    console.log("Add Pupil: "+JSON.stringify(pupil)+ " to course "+JSON.stringify(course));
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/klasse/verwaltung/add/";  // URL to web API
    console.log("URL="+this.url);
    var body = {ID_SCHUELER: pupil.id, ID_KLASSE:course.id};
    return this.http.post(this.url,body,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  removePupilFromCourse(pupil:Pupil,course:Course) {
    console.log("Remove Pupil: "+JSON.stringify(pupil)+ " to course "+JSON.stringify(course));
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/klasse/verwaltung/"+pupil.id+"/"+course.id;  // URL to web API
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
