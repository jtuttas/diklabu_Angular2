import {Inject, Injectable} from "@angular/core";
import {Http,Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {CourseBookComponent} from "../CourseBookComponent";
import {AppComponent} from "../app.component";
import {MailObject} from "../data/MailObject";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Config} from "../data/Config";
import {DOCUMENT} from "@angular/platform-browser/src/dom/dom_tokens";

@Injectable()
export class MailService {
  private url;
  constructor (private http: Http) {
  }

  private extractData(res: Response) {
    try {
      console.log("Receive Mail Servlet: " + JSON.stringify(res.json()));
      let body = res.json();
      return body;
    }
    catch(e) {
      console.log("Antwort vom Mail Servlet ist kein JSON");
      return "";
    }
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

  sendMail(mail:MailObject) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/x-www-form-urlencoded;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/MailServlet";  // URL to web API
    var body = mail.getBody();
    console.log("body="+body);
    return this.http.post(this.url,body,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }


  getTemplate(s: string, url:string) {
    url = url +"/"+s;  // URL to web API
    return this.http.get(url)
      .map(res => {return res.text();})
      .catch(this.handleError);
  }
}
