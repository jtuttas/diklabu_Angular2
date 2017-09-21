import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AppComponent} from "../app.component";
import {CourseBookComponent} from "../CourseBookComponent";
import {Pupil} from "../data/Pupil";

@Injectable()
export class PupilService {

  private url;
  constructor (private http: Http) {}

  getPupils(kname:string): Observable<Pupil[]> {
    this.url = AppComponent.SERVER+"Diklabu/api/v1/klasse/"+kname;  // URL to web API
    console.log("get pupils URL="+this.url);
    return this.http.get(this.url)
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
