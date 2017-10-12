import {Component, ViewChild} from "@angular/core";
import {SharedService} from "./services/SharedService";
import {AnwesenheitsService} from "./services/AnwesenheitsService";
import {MessageService} from "primeng/components/common/messageservice";
import {Pupil} from "./data/Pupil";
import {Subscription} from "rxjs/Subscription";
import {CourseSelectComponent} from "./CourseSelectComponent";
import {APupil} from "./data/APupil";
import {CourseService} from "./services/CourseService";
import {CourseBookComponent} from "./CourseBookComponent";
import {DokuComponent} from "./DokuComponent";
import {CourseBook} from "./data/CourseBook";
import {DokuService} from "./services/DokuService";
import {Anwesenheitseintrag} from "./data/Anwesenheitseintrag";

@Component({
  selector: 'todayanwesenheit',
  styles: ['input {width:100%;}img {border-style: solid;border-width: 4px;border-color: gray}'],
  templateUrl: './TodayAnwesenheitsComponente.html'
})
export class TodayAnwesenheitsComponente {
  @ViewChild('infoDialog') infoDialog;

  public pupils: APupil[];
  subscription: Subscription;
  public today:Date=new Date();

  public vermerke: string[] = ['a', 'f', 'e'];

  // Injizieren der notwendigen Services
  constructor(private service: SharedService, private anwesenheitsService: AnwesenheitsService, private messageService: MessageService, private courseService: CourseService,private dokuService:DokuService) {
    console.log(" TodayAnwesenheits Component constructor");
    this.pupils = <APupil[]>CourseSelectComponent.pupils;
    for (var i = 0; i < this.pupils.length; i++) {
      this.pupils[i].imageSrc = "../assets/anonym.gif"
      this.pupils[i].vermerkIndex = 0;
    }
    this.updateAnwesenheit();
    this.updateImages();

  }

  ngOnInit() {
    // Doku Component unsichtbar schalten, da es hierzu keine Dokumentation gibt.
    this.dokuService.setDisplayDoku(false);
    // Beim CourseBook unterschreiben (Observer), um über Änderung am Klassenbuch (Klasse, Zeitbereit) informiert zu werden
    this.subscription = this.service.getCoursebook().subscribe(message => {
      console.log("TodayAnwesenheits Component new Data !" + message.constructor.name);
      this.pupils = <APupil[]>CourseSelectComponent.pupils;
      for (var i = 0; i < this.pupils.length; i++) {
        this.pupils[i].imageSrc = "../assets/anonym.gif"
        this.pupils[i].vermerkIndex = 0;
      }
      this.updateAnwesenheit();
      this.updateImages();
    });
  }

  ngOnDestroy() {
    // Beim CourseBook (Obbserver abmelden !)
    this.subscription.unsubscribe();
  }

  vermekChanged(event, p:APupil) {
    console.log(event.keyCode)
    if(event.keyCode == 13 || event.keyCode == 9) {
      console.log("Vermek Changed for "+JSON.stringify(p));
      this.sendAnwesenheit(p);
    }
  }
  bemerkungChanged(event, p:APupil) {
    if(event.keyCode == 13 || event.keyCode == 9) {
      console.log("Bemerkung Changed for "+JSON.stringify(p));
      this.sendAnwesenheit(p);
    }
  }

  vermerkFokusChanged(p:APupil) {
      console.log("Vermek Changed for "+JSON.stringify(p));
      this.sendAnwesenheit(p);
  }
  bemerkungFokusChanged(p:APupil) {
      console.log("Bemerkung Changed for "+JSON.stringify(p));
    this.sendAnwesenheit(p);
  }

  sendAnwesenheit(p:APupil) {
    let a: Anwesenheitseintrag = new Anwesenheitseintrag();
    a.DATUM=CourseBook.toSQLString(this.today)+"T00:00:00";
    a.ID_KLASSE=CourseBookComponent.courseBook.course.id;
    a.ID_LEHRER=CourseBookComponent.courseBook.idLehrer;
    a.ID_SCHUELER=p.id;
    a.VERMERK=p.vermerk;
    a.BEMERKUNG=p.vermerkBemerkung;

    if (a.VERMERK=="") {
      this.anwesenheitsService.deleteAnwesenheit(a);
    }
    else {
      this.anwesenheitsService.setAnwesenheit(a).subscribe(
        data => {
          console.log("Recieved" + JSON.stringify(data));
          if (data.parseError) {
            this.messageService.add({
              severity: 'warning',
              summary: 'Warnung',
              detail: "Formatierungsfehler im Eintrag " + a.VERMERK
            });
          }
        },
        err => {
          console.log("Recieved err" + err);
          this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
        }
      );
    }
  }

  updateAnwesenheit() {
    this.anwesenheitsService.getTodaysAnwesenheit().subscribe(
      data => {
        var anw:any[]=data;
        console.log("Recieved todays Anwesenheit "+JSON.stringify(data));
        for (var i=0;i<anw.length;i++) {
          var id = anw[i].id_Schueler;
          for (var j = 0; j < this.pupils.length; j++) {
            if (this.pupils[j].id==id) {
              this.pupils[j].vermerk=anw[i].eintraege[0].VERMERK;
              this.pupils[j].vermerkBemerkung=anw[i].eintraege[0].BEMERKUNG;
              break;
            }
          }
        }
      },
      err => {
        this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
      }
    );
  }

  updateImages() {
    this.courseService.getCoursePictures(CourseBookComponent.courseBook.course.KNAME, 100).subscribe(
      data => {
        var imgData:any[] = data;
        //console.log("Received Course Images! Nubmer="+imgData.length);
        for (var i = 0; i < imgData.length; i++) {
          var id=imgData[i].id;

          if (imgData[i].base64) {
            let base64: string = imgData[i].base64;
            var patt = /(?:\r\n|\r|\n)/g;
            base64 = base64.replace(patt, "");
            console.log("Image for ID=" + id + " ist " + base64);

            for (var j=0;j<this.pupils.length;j++) {
              if (this.pupils[j].id==id) {
                this.pupils[j].imageSrc="data:image/png;base64,"+base64;
              }
            }
          }
          else {
            console.log("No Image for ID=" + id );

          }
        }
      }
      ,
      err => {
        this.messageService.add({severity: 'error', summary: 'Fehler', detail: err});
      }
    );
  }

  selectPupil(p: APupil) {
    console.log("Details Pupil:" + JSON.stringify(p));
    this.infoDialog.showDialog(p);
  }

  getImageBorder(p: APupil) {
    if (p.vermerk == undefined) {
      return "gray";
    }
    if (p.vermerk.startsWith('ag')) {
      return "red";
    }
    if (p.vermerk.startsWith('a')) {
      return "green";
    }
    if (p.vermerk.startsWith('v')) {
      return "green";
    }
    if (p.vermerk.startsWith('e')) {
      return "yellow";
    }
    if (p.vermerk.startsWith('f')) {
      return "red";
    }
    return "gray"
  }

  changeAnwesenheit(p: APupil) {
    if (p.vermerkIndex == undefined) {
      p.vermerkIndex = 0;
    }
    p.vermerk = this.vermerke[p.vermerkIndex];
    this.sendAnwesenheit(p);
    console.log("Change Anwenheit to:" + p.vermerk + " Index=" + p.vermerkIndex + " Vermerke=" + this.vermerke);
    p.vermerkIndex++;
    if (p.vermerkIndex >= this.vermerke.length) {
      p.vermerkIndex = 0;
    }
  }
}
