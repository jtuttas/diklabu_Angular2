import { Injectable }              from '@angular/core';
import { Http, Response, Headers }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AppComponent} from "../app.component";
import {CourseBookComponent} from "../CourseBookComponent";
import {CourseBook} from "../data/CourseBook";
import {Anwesenheit} from "../data/Anwesenheit";
import {Anwesenheitseintrag} from "../data/Anwesenheitseintrag";
import {Config} from "../data/Config";



@Injectable()
export class AnwesenheitsService {

  public static anwesenheit;
  private url;
  constructor (private http: Http) {
  }

  getAnwesenheit(): Observable<Anwesenheit[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/anwesenheit/"+CourseBookComponent.courseBook.course.KNAME+"/"+CourseBook.toSQLString(CourseBookComponent.courseBook.fromDate)+"/"+CourseBook.toSQLString(CourseBookComponent.courseBook.toDate);  // URL to web API
    console.log("URL="+this.url);

    return this.http.get(this.url,{headers: headers})
      .map(data => {AnwesenheitsService.anwesenheit=data.json();return data.json()})
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log("Receive Anwesenheit: "+JSON.stringify(res.json()));
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

  setAnwesenheit(anwesenheit: Anwesenheitseintrag) {
    console.log("set Anwesneheit: "+JSON.stringify(anwesenheit));
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/anwesenheit/";  // URL to web API
    console.log("URL="+this.url);
    return this.http.post(this.url,anwesenheit,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteAnwesenheit(anwesenheit: Anwesenheitseintrag) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER + "Diklabu/api/v1/anwesenheit/" + anwesenheit.ID_SCHUELER + "/" + anwesenheit.DATUM.substring(0,anwesenheit.DATUM.indexOf("T"));  // URL to web API
    console.log("DELETE URL=" + this.url);
    return this.http.delete(this.url,{headers: headers}).subscribe((res) => {
    });
  }
}
