import {Injectable} from "@angular/core";
import {Http,Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CourseBookComponent} from "../CourseBookComponent";
import {AppComponent} from "../app.component";
import {Config} from "../data/Config";
import {PupilDetails} from "../data/PupilDetails";

@Injectable()
export class PupilDetailService {
  private url;
  constructor (private http: Http) {
  }

  private extractData(res: Response) {
      console.log("Receive Pupil Details: " + JSON.stringify(res.json()));
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


  getPupilDetails(id:number) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/x-www-form-urlencoded;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/schueler/"+id;  // URL to web API
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPupilImage(id:number) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/x-www-form-urlencoded;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/schueler/bild64/"+id;  // URL to web API
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  setInfo(id, bem) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json; charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/schueler/"+id;  // URL to web API
    var body={id: id,info: bem};
    return this.http.post(this.url,JSON.stringify(body),{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }
}
