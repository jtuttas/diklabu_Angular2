import {Component, EventEmitter, Host, Input, Output, ViewChild, ViewContainerRef} from "@angular/core";
import {AppComponent} from "./app.component";
import {Http, Headers, RequestMethod, RequestOptions, RequestOptionsArgs, ResponseContentType} from "@angular/http";
import {Verlauf} from "./data/Verlauf";
import {CourseBookComponent} from "./CourseBookComponent";
import {MessageService} from "primeng/components/common/messageservice";


@Component({
  selector: 'newverlauf',
  templateUrl: './NewVerlaufComponent.html',
  styleUrls: ['./NewVerlaufComponent.css']
})


export class NewVerlaufComponent {
  @Output() newVerlauf = new EventEmitter();
  @ViewChild('dateComponent') dateComponent;
  @ViewChild('lfSelectComponent') lfSelectComponent;

  public compDisabled: boolean = true;
  public lernsituation:string="";
  public inhalt:string="";
  public bemerkungen:string="";
  public stunden = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  public stundeindex:number=0;
  public http:Http;
  public verlauf:Verlauf;

  constructor(http: Http,private messageService: MessageService) {
    this.http=http;
  }

  lfLoaded() {
    this.compDisabled=false;
  }

  public toString() {
    console.log("Verlauf: LS="+this.lernsituation+" Inhalt="+this.inhalt+" Bem:"+this.bemerkungen);
  }

  public setVerlauf(v:Verlauf):void {
    this.lernsituation=v.AUFGABE;
    this.bemerkungen=v.BEMERKUNG;
    this.dateComponent.d=new Date(v.DATUM);
    CourseBookComponent.courseBook.course.id=v.ID_KLASSE;
    this.lfSelectComponent.lfid=this.lfSelectComponent.getLfNumber(v.ID_LERNFELD);
    console.log("SET LF Number to "+this.lfSelectComponent.lfid);
    this.inhalt=v.INHALT;
    this.stundeindex= (+v.STUNDE)-1;
  }

  public addClick() {
    console.log("Add click");
    if (this.inhalt=="") {
      this.messageService.add({severity:'warning', summary:'Warning', detail:'Geben Sie wenigstens einen Inhalt an!'});
    }
    else {
      let body:any = {
        AUFGABE: this.lernsituation,
        BEMERKUNG: this.bemerkungen,
        DATUM: this.dateComponent.d,
        ID_KLASSE: CourseBookComponent.courseBook.course.id,
        ID_LEHRER: CourseBookComponent.courseBook.idLehrer,
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
            //this.toastr.warning(data.msg, 'Warnung!');
          }
          this.verlauf=new Verlauf(this.inhalt,this.stunden[this.stundeindex],CourseBookComponent.courseBook.idLehrer,CourseBookComponent.courseBook.course.id,this.dateComponent.d);
          this.verlauf.AUFGABE=this.lernsituation;
          this.verlauf.BEMERKUNG=this.bemerkungen;
          this.verlauf.ID_LERNFELD=this.lfSelectComponent.getSelectedLernfeld().id;
          this.verlauf.INHALT=this.inhalt;
          this.verlauf.ID=data.ID;
          if (this.stundeindex<this.stunden.length-1) {
            this.stundeindex++;
          }
          this.newVerlauf.emit(this.verlauf);
          //this.listener.componentChanged(this);
        },
        (x) => {
          /* this function is executed when there's an ERROR */
          this.messageService.add({severity:'error', summary:'Fehler', detail:x});
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
