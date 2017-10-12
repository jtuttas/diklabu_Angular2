import {Component, EventEmitter, Host, Input, Output, ViewChild, ViewContainerRef} from "@angular/core";
import {AppComponent} from "./app.component";
import {Verlauf} from "./data/Verlauf";
import {CourseBookComponent} from "./CourseBookComponent";
import {MessageService} from "primeng/components/common/messageservice";
import {VerlaufsService} from "./services/VerlaufsService";
import {SelectItem} from "primeng/primeng";
import {SharedService} from "./services/SharedService";
import {Subscription} from "rxjs/Subscription";
import {bootstrapItem} from "@angular/cli/lib/ast-tools";
import {CourseBook} from "./data/CourseBook";


@Component({
  selector: 'newverlauf',
  templateUrl: './NewVerlaufComponent.html',
  styleUrls: ['./NewVerlaufComponent.css']
})


export class NewVerlaufComponent {
  @Output() newVerlauf = new EventEmitter();
  @ViewChild('dateComponent') dateComponent;
  @ViewChild('lfSelectComponent') lfSelectComponent;
  subscription: Subscription;
  public compDisabled: boolean = true;
  public lernsituation:string="";
  public inhalt:string="";
  public bemerkungen:string="";
  public stunden : SelectItem[];
  public selectedStundeIndex:number=0;
  public selectedStunde;
  //private verlaufID;

  public verlauf:Verlauf=new Verlauf("","","",0,"");

  constructor( private verlaufsService : VerlaufsService,private messageService: MessageService,private service:SharedService) {
    this.stunden = [];
    this.stunden.push({label: '1.(8:00-8:45)', value: '01'});
    this.stunden.push({label: '2.(8:45-9:30)', value: '02'});
    this.stunden.push({label: '3.(9:50-10:35)', value: '03'});
    this.stunden.push({label: '4.(10:35-11:20)', value: '04'});
    this.stunden.push({label: '5.(11:40-12:25)', value: '05'});
    this.stunden.push({label: '6.(12:25-13:10)', value: '06'});
    this.stunden.push({label: '7.(13:30-14:15)', value: '07'});
    this.stunden.push({label: '8.(14:15-15:00)', value: '08'});
    this.stunden.push({label: '9.(15:20-16:05)', value: '09'});
    this.stunden.push({label: '10.(16:05-16:50)', value: '10'});
    this.stunden.push({label: '11. ', value: '11'});
    this.stunden.push({label: '12. ', value: '12'});
    this.stunden.push({label: '13. ', value: '13'});
    this.stunden.push({label: '14. ', value: '14'});
    this.stunden.push({label: '15. ', value: '15'});
    this.selectedStundeIndex=0;
    this.selectedStunde=this.stunden[this.selectedStundeIndex].value

  }

  ngOnInit() {
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("New Verlauf Component Received !"+message.constructor.name);
      delete this.verlauf.ID;
    });
  }

  ngOnDelete() {
    this.subscription.unsubscribe();
  }

  stundeChanged() {
    for (var i=0;i<this.stunden.length;i++) {
      if (this.selectedStunde==this.stunden[i].value) {
        this.selectedStundeIndex=i;
      }
    }
    console.log(" Set Selected Index to "+this.selectedStundeIndex);
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
    this.dateComponent.d.setHours(0,0,0,0);;
    CourseBookComponent.courseBook.course.id=v.ID_KLASSE;
    this.lfSelectComponent.selectedLF=v.ID_LERNFELD;
    console.log("SET LF Number to "+this.lfSelectComponent.lfid);
    this.inhalt=v.INHALT;
    this.selectedStunde= v.STUNDE;
    this.selectedStundeIndex=+v.STUNDE-1;
    this.verlauf=v;
    console.log("set Verlauf to "+JSON.stringify(this.verlauf));
  }

  public addClick() {
    console.log("Add click"+CourseBook.toSQLString(this.dateComponent.d));
    if (this.inhalt=="") {
      this.messageService.add({severity:'warning', summary:'Warning', detail:'Geben Sie wenigstens einen Inhalt an!'});
    }
    else {
      this.verlauf.INHALT=this.inhalt;
      this.verlauf.STUNDE=this.stunden[this.selectedStundeIndex].value;
      this.verlauf.ID_LEHRER=CourseBookComponent.courseBook.idLehrer;
      this.verlauf.ID_KLASSE=CourseBookComponent.courseBook.course.id;
      this.verlauf.DATUM=CourseBook.toSQLString(this.dateComponent.d)+"T00:00:00";
      this.verlauf.AUFGABE = this.lernsituation;
      this.verlauf.BEMERKUNG = this.bemerkungen;
      this.verlauf.ID_LERNFELD = this.lfSelectComponent.getSelectedLernfeld();
      delete this.verlauf.ID;
      console.log("Send to Server: "+JSON.stringify(this.verlauf));

      this.verlaufsService.newVerlauf(this.verlauf).subscribe(data =>{
        console.log("VALUE RECEIVED: ",JSON.stringify(data));
          if (data.success==false) {
            // alter Eintrag aktualisieren
            this.messageService.add({severity:'warning', summary:'Warnung', detail:data.msg});
          }

          this.newVerlauf.emit(data);

          this.selectedStundeIndex++;
          if (this.selectedStundeIndex>this.stunden.length-1) {
            this.selectedStundeIndex=this.stunden.length-1;
          }
          this.verlauf=new Verlauf(this.inhalt,this.stunden[this.selectedStundeIndex].value,CourseBookComponent.courseBook.idLehrer,CourseBookComponent.courseBook.course.id,this.dateComponent.d);
          this.verlauf.AUFGABE = this.lernsituation;
          this.verlauf.BEMERKUNG = this.bemerkungen;
          this.verlauf.ID_LERNFELD = this.lfSelectComponent.getSelectedLernfeld().id;
          this.selectedStunde=this.stunden[this.selectedStundeIndex].value;
      },
        err => {
          this.messageService.add({severity:'error', summary:'Fehler', detail:err});
        });
    }
  }

  resetForm() {
    this.inhalt="";
    this.lernsituation="";
    this.bemerkungen="";
    this.selectedStundeIndex=0;
    this.selectedStunde=this.stunden[this.selectedStundeIndex].value
    this.stunden[this.selectedStundeIndex].value;
    this.lfSelectComponent.selectedLF=this.lfSelectComponent.lfs[0].value;
  }
}
