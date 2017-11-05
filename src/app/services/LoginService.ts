import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {AppComponent} from "../app.component";
import {Login} from "../data/Login";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {CourseBookComponent} from "../CourseBookComponent";
import {Headers} from '@angular/http';
import {Config} from "../data/Config";


@Injectable()
export class LoginService {

  private url;
  constructor (private http: Http) {}

  performLogin(user:string,password:string): Observable<Login> {
    this.url = Config.SERVER+"Diklabu/api/v1/auth/login/";  // URL to web API
    console.log("LoginURL:"+this.url);
    var body = {benutzer: user,kennwort:password};
    return this.http.post(this.url,body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  setPin(pin:number,uid:string): Observable<Login> {
    this.url = Config.SERVER+"Diklabu/api/v1/auth/setpin/";  // URL to web API
    console.log("LoginURL:"+this.url);
    var body = {pin: pin,uid: uid};
    console.log(" Sende zum Server: "+JSON.stringify(body));
    return this.http.post(this.url,body)
      .map(this.extractData)
      .catch(this.handleError);
  }



  private extractData(res: Response) {
    console.log("URL="+this.url);
    console.log("Receive Login: "+JSON.stringify(res.json()));
    let body = res.json();
    return body;
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = err;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  performLogout(user:string,password:string): Observable<Login>  {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");

    this.url = Config.SERVER+"Diklabu/api/v1/auth/logout/";  // URL to web API
    console.log("LooutURL:"+this.url);
    var body = {benutzer: user,kennwort:password};
    return this.http.post(this.url,body,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }
}
