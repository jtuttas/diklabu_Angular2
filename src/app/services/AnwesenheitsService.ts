import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AppComponent} from "../app.component";
import {CourseBookComponent} from "../CourseBookComponent";
import {Pupil} from "../data/Pupil";
import {CourseBook} from "../data/CourseBook";
import {Anwesenheit} from "../data/Anwesenheit";
import {Anwesenheitseintrag} from "../data/Anwesenheitseintrag";

@Injectable()
export class AnwesenheitsService {

  private url;
  constructor (private http: Http) {}

  getAnwesenheit(): Observable<Anwesenheit[]> {
    this.url = AppComponent.SERVER+"Diklabu/api/v1/anwesenheit/"+CourseBookComponent.courseBook.course.KNAME+"/"+CourseBook.toSQLString(CourseBookComponent.courseBook.fromDate)+"/"+CourseBook.toSQLString(CourseBookComponent.courseBook.toDate);  // URL to web API
    console.log("URL="+this.url);
    return this.http.get(this.url)
      .map(this.extractData)
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
    this.url = AppComponent.SERVER+"Diklabu/api/v1/anwesenheit/";  // URL to web API
    console.log("URL="+this.url);
    return this.http.post(this.url,anwesenheit)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteAnwesenheit(anwesenheit: Anwesenheitseintrag) {
    this.url = AppComponent.SERVER + "Diklabu/api/v1/anwesenheit/" + anwesenheit.ID_SCHUELER + "/" + anwesenheit.DATUM.substring(0,anwesenheit.DATUM.indexOf("T"));  // URL to web API
    console.log("DELETE URL=" + this.url);
    return this.http.delete(this.url).subscribe((res) => {
    });
  }
}
