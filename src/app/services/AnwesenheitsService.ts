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
import {PupilDetails} from "../data/PupilDetails";
import {PupilDetailService} from "./PupilDetailService";
import {MessageService} from "primeng/components/common/messageservice";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {HttpService} from "../loader/HttpService";



@Injectable()
export class AnwesenheitsService {

  public static anwesenheit;
  private url;
  constructor (private http: HttpService,private pupilDetailService:PupilDetailService) {
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

  getTodaysAnwesenheit(): Observable<Anwesenheit[]> {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/anwesenheit/"+CourseBookComponent.courseBook.course.KNAME;  // URL to web API
    console.log("URL="+this.url);

    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTermiondaten(idFilter1:number,idFilter2:number) {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/noauth/termine/"+CourseBook.toSQLString(CourseBookComponent.courseBook.fromDate)+"/"+CourseBook.toSQLString(CourseBookComponent.courseBook.toDate)+"/"+idFilter1+"/"+idFilter2;  // URL to web API
    console.log("URL="+this.url);
    return this.http.get(this.url,{headers: headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTermine() {
    var headers = new Headers();
    headers.append("auth_token", ""+CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type","application/json;  charset=UTF-8");
    this.url = Config.SERVER+"Diklabu/api/v1/noauth/termine/"
    console.log("URL="+this.url);
    return this.http.get(this.url,{headers: headers})
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

  fillFehlzeitenbericht (template:string, a: Anwesenheit, filledOut: (content:string,recipient:string)=>void) {
    let content = "";
    this.pupilDetailService.getPupilDetails(a.id_Schueler).subscribe(data => {
        content = <string>template;
        let pd: PupilDetails = data;
        content = content.replace("[[BETRIEB_NAME]]", pd.betrieb.NAME);
        content = content.replace("[[BETRIEB_STRASSE]]", pd.betrieb.STRASSE);
        content = content.replace("[[BETRIEB_PLZ]]", pd.betrieb.PLZ);
        content = content.replace("[[BETRIEB_ORT]]", pd.betrieb.ORT);
        content = content.replace("[[AUSBILDER_NNAME]]", pd.ausbilder.NNAME);
        content = content.replace("[[SCHUELER_NAME]]", pd.vorname + " " + pd.name);
        content = content.replace("[[SCHUELER_KLASSE]]", CourseBookComponent.courseBook.course.KNAME);

        content = content.replace("[[START_DATUM]]", CourseBook.toReadbleString(CourseBookComponent.courseBook.fromDate));
        content = content.replace("[[END_DATUM]]", CourseBook.toReadbleString(CourseBookComponent.courseBook.toDate));
        content = content.replace("[[ANZAHL_FEHLTAGE]]", ""+a.summeFehltage);

        let eintraege="";
        for (var i=0;i<a.fehltageEntschuldigt.length;i++) {
          eintraege+=CourseBook.toReadbleString(new Date(a.fehltageEntschuldigt[i].DATUM));
          if (i!=a.fehltageEntschuldigt.length-1) {
            eintraege+=", ";
          }
        }
        content = content.replace("[[DATUM_ENTSCHULDIGT]]", eintraege);

        eintraege="";
        for (var i=0;i<a.fehltageUnentschuldigt.length;i++) {
          eintraege+=CourseBook.toReadbleString(new Date(a.fehltageUnentschuldigt[i].DATUM))+" ";
          if (i!=a.fehltageUnentschuldigt.length-1) {
            eintraege+=", ";
          }
        }
        content = content.replace("[[DATUM_UNENTSCHULDIGT]]", eintraege);

        content = content.replace("[[LEHRER_NNAME]]", ""+CourseBookComponent.courseBook.username);
        content = content.replace("[[LEHRER_EMAIL]]", ""+CourseBookComponent.courseBook.email);

        filledOut(content,pd.ausbilder.EMAIL);
      },
      err => {
        console.log("Fehler beim Laden der Details von Schüler mit ID="+a.id_Schueler);
      });
  }

}
