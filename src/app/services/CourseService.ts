import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {CourseBookComponent} from "../CourseBookComponent";
import {AppComponent} from "../app.component";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Config} from "../data/Config";

@Injectable()
export class CourseService {

  private url;

  constructor(private http: Http) {
  }


  getStundenplan(kname:string) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/noauth/plan/stundenplan/"+kname;  // URL to web API
    console.log("get stundenplan URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractPlainData)
      .catch(this.handleError);
  }

  getVertretungsplan(kname:string) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/noauth/plan/vertertungsplan/"+kname;  // URL to web API
    console.log("get Vertretungsplan  URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractPlainData)
      .catch(this.handleError);
  }

  getCourseInfo(idKlasse:number) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/klasse/details/"+idKlasse;  // URL to web API
    console.log("get CourseInfo  URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  setCourseInfo(idKlasse:number,notiz:string) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/klasse/details/"+idKlasse;  // URL to web API
    console.log("set CourseInfo  URL="+this.url);
    var body={"NOTIZ":notiz};
    return this.http.post(this.url,JSON.stringify(body),{headers: headers})
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
