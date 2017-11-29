import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {CourseBookComponent} from "../CourseBookComponent";
import {Config} from "../data/Config";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Grade} from "../data/Grades";
import {HttpService} from "../loader/HttpService";

@Injectable()
export class NotenService {

  private url:string;

  constructor(private http: HttpService) {
  }

  getCurrentYear() {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/schuljahr";  // URL to web API
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getGrades(kname:string,idSchuljahr:number) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/noten/"+kname+"/"+idSchuljahr;  // URL to web API
    console.log("get Grades  URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  setGrade(grade:Grade,idCourse:number) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/noten/"+idCourse;  // URL to web API
    console.log("get Grades  URL="+this.url);
    return this.http.post(this.url,JSON.stringify(grade),{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteGrade(grade:Grade) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/noten/"+grade.ID_LERNFELD+"/"+grade.ID_SCHUELER;  // URL to web API
    console.log("get Grades  URL="+this.url);
    return this.http.delete(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log("URL="+this.url);
    console.log("Receive Data: "+JSON.stringify(res.json()));
    let body = res.json();
    return body;
  }

  private extractPlainData(res: Response) {
    return res.text();
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
