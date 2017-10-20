import {Injectable} from "@angular/core";
import {Http, Headers, ResponseContentType, RequestOptions} from "@angular/http";
import {AppComponent} from "../app.component";
import {CourseBookComponent} from "../CourseBookComponent";
import {Config} from "../data/Config";
import {Termin} from "../data/Termin";

@Injectable()
export class DokuService {

  private url;
  public static displayDoku:boolean=false;
  public static view:string="Verlauf";
  public static anwFilter1:number;
  public static anwFilter2:number;

  setDisplayDoku(b:boolean, view?:string) {
    DokuService.displayDoku=b;
    DokuService.view=view;
  }

  setDokuFilter(t1:Termin,t2:Termin) {
    DokuService.anwFilter1=t1.id;
    DokuService.anwFilter2=t2.id;
  }

  isVisible():boolean {
    return DokuService.displayDoku;
  }

  constructor(private http: Http) {
  }

  getDoku(body) {
    var headers = new Headers();
    headers.append("auth_token", "" + CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type", "application/x-www-form-urlencoded;  charset=UTF-8");
    let options = new RequestOptions({ headers: headers });
// Ensure you set the responseType to Blob.
    options.responseType = ResponseContentType.Blob;

    return this.http.post(Config.SERVER+"Diklabu/DokuServlet",body,options)
      .map((res) => {
        console.log("-->"+JSON.stringify(res));
        let fileBlob = res.blob();
        return fileBlob;
    })
  }
}
