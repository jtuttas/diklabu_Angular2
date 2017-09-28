import {Component, EventEmitter, Host, Input, Output, ViewChild, ViewContainerRef} from "@angular/core";
import {AppComponent} from "./app.component";
import {Verlauf} from "./data/Verlauf";
import {CourseBookComponent} from "./CourseBookComponent";
import {MessageService} from "primeng/components/common/messageservice";
import {VerlaufsService} from "./services/VerlaufsService";


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

  public verlauf:Verlauf;

  constructor( private verlaufsService : VerlaufsService,private messageService: MessageService) {

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
      let v: Verlauf=new Verlauf(this.inhalt,this.stunden[this.stundeindex],CourseBookComponent.courseBook.idLehrer,CourseBookComponent.courseBook.course.id,this.dateComponent.d);
      v.AUFGABE = this.lernsituation;
      v.BEMERKUNG = this.bemerkungen;
      v.ID_LERNFELD = this.lfSelectComponent.getSelectedLernfeld().id;

      this.verlaufsService.newVerlauf(v).subscribe(data =>{
        console.log("VALUE RECEIVED: ",data);
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

      },
        err => {
          this.messageService.add({severity:'error', summary:'Fehler', detail:err});
        });
    }
  }
}
