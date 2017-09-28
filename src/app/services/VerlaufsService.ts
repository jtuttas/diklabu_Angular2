import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Verlauf} from "../data/Verlauf";
import {CourseBookComponent} from "../CourseBookComponent";
import {AppComponent} from "../app.component";
import {CourseBook} from "../data/CourseBook";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class VerlaufsService {

  private url;

  constructor(private http: Http) {
  }

  getVerlauf(): Observable<Verlauf[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = AppComponent.SERVER + "/Diklabu/api/v1/verlauf/" + CourseBookComponent.courseBook.course.KNAME + "/" + CourseBook.toSQLString(CourseBookComponent.courseBook.fromDate) + "/" + CourseBook.toSQLString(CourseBookComponent.courseBook.toDate);
    console.log("URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteVerlauf(v: Verlauf): Observable<Verlauf[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = AppComponent.SERVER + "/Diklabu/api/v1/verlauf/" + v.ID
    console.log("URL="+this.url);
    return this.http.delete(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    console.log("Receive Verlauf: "+JSON.stringify(res.json()));
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

  newVerlauf(v: Verlauf) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = AppComponent.SERVER+ 'Diklabu/api/v1/verlauf/'
    console.log("URL="+this.url);
    return this.http.post(this.url,JSON.stringify(v),{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }
}
