import {Component, Input, ViewChild, ViewContainerRef} from "@angular/core";
import {ComponentChangedListener} from "./data/ComponentChangedListener";
import {AppComponent} from "./app.component";
import {ToastModule, ToastsManager} from "ng2-toastr";
import {Lernfeld} from "./data/Lernfeld";
import {LFSelectComponent} from "./LFSelectComponent";
import {BrowserModule} from "@angular/platform-browser";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {MaterialModule} from "@angular/material";
import {Http, Headers, RequestMethod, RequestOptions, RequestOptionsArgs, ResponseContentType} from "@angular/http";
import {Verlauf} from "./data/Verlauf";



@Component({
  selector: 'newverlauf',
  templateUrl: './NewVerlaufComponent.html',
  styleUrls: ['./NewVerlaufComponent.css']
})


export class NewVerlaufComponent implements ComponentChangedListener{
  componentChanged(c:any): void {
  }

  componentInit(c:any): void {
    this.compDisabled=false;
  }

  @ViewChild('dateComponent') dateComponent;
  @ViewChild('lfSelectComponent') lfSelectComponent;
  @Input() listener: ComponentChangedListener;

  public compDisabled: boolean = true;
  public lernsituation:string="";
  public inhalt:string="";
  public bemerkungen:string="";
  public stunden = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  public stundeindex:number=0;
  public http:Http;
  public verlauf:Verlauf;

  constructor(http: Http, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.http=http;
  }

  public toString() {
    console.log("Verlauf: LS="+this.lernsituation+" Inhalt="+this.inhalt+" Bem:"+this.bemerkungen);
  }

  public addClick() {
    console.log("Add click");
    if (this.inhalt=="") {
      this.toastr.info('Bitte geben Sie wenigstens einen Inhalt an.', 'Hinweis!');
    }
    else {
      let body:any = {
        AUFGABE: this.lernsituation,
        BEMERKUNG: this.bemerkungen,
        DATUM: this.dateComponent.d,
        ID_KLASSE: AppComponent.courseBook.course.id,
        ID_LEHRER: AppComponent.courseBook.idLehrer,
        ID_LERNFELD: this.lfSelectComponent.getSelectedLernfeld().id,
        INHALT: this.inhalt,
        STUNDE: this.stunden[this.stundeindex]
      };

      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      console.log (JSON.stringify(body));

      this.http.post(
        AppComponent.SERVER+ 'Diklabu/api/v1/verlauf/',
        JSON.stringify(body),
        {headers:headers}
      ).subscribe(
        (res:any) => {
          console.log("VALUE RECEIVED: ",res);
          var data=JSON.parse(res._body);
          if (data.success==false) {
            this.toastr.warning(data.msg, 'Warnung!');
          }
          this.verlauf=new Verlauf(this.inhalt,this.stunden[this.stundeindex],AppComponent.courseBook.idLehrer,AppComponent.courseBook.course.id,this.dateComponent.d);
          this.verlauf.AUFGABE=this.lernsituation;
          this.verlauf.BEMERKUNG=this.bemerkungen;
          this.verlauf.ID_LERNFELD=this.lfSelectComponent.getSelectedLernfeld().id;
          this.verlauf.INHALT=this.inhalt;
          this.listener.componentChanged(this);
        },
        (x) => {
          /* this function is executed when there's an ERROR */
          this.toastr.error(x.toString(), 'Fehler!');
          console.log("ERROR: "+x);
        },
        () => {
          /* this function is executed when the observable ends (completes) its stream */
          console.log("Completed");
        }
      );

    }
  }
}
