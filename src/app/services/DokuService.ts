import {Injectable} from "@angular/core";
import {Http, Headers, ResponseContentType, RequestOptions} from "@angular/http";
import {AppComponent} from "../app.component";
import {CourseBookComponent} from "../CourseBookComponent";

@Injectable()
export class DokuService {

  private url;

  constructor(private http: Http) {
  }

  getDoku(body) {
    var headers = new Headers();
    headers.append("auth_token", "" + CourseBookComponent.courseBook.auth_token);
    headers.append("Content-Type", "application/x-www-form-urlencoded;  charset=UTF-8");
    let options = new RequestOptions({ headers: headers });
// Ensure you set the responseType to Blob.
    options.responseType = ResponseContentType.Blob;

    return this.http.post(AppComponent.SERVER+"Diklabu/DokuServlet",body,options)
      .map((res) => {
        console.log("-->"+JSON.stringify(res));
        let fileBlob = res.blob();
        return fileBlob;
    })
  }
}
