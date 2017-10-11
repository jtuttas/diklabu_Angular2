import {AppComponent} from "../app.component";
import {CourseBookComponent} from "../CourseBookComponent";

export class Verlauf {
  AUFGABE:string="";
  BEMERKUNG:string="";
  DATUM:string="";
  ID:number;
  ID_KLASSE:number=-1;
  ID_LEHRER:string="";
  ID_LERNFELD:string="";
  INHALT:string="";
  STUNDE:string="";
  kw:number=0;
  wochentag:string="";
  success:boolean=true;

  static wochentage=["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."];

  constructor(inhalt:string,stunde:string,id_lehrer,id_klasse:number,d:string) {
    this.INHALT=inhalt;
    this.STUNDE=stunde;
    this.ID_LEHRER=id_lehrer;
    this.ID_KLASSE=id_klasse;
    this.DATUM=d;
    this.wochentag=Verlauf.wochentage[new Date(d).getDay()];
    console.log("Neuer Verlauf  Wochentag="+this.wochentag);
  }

  isOwnEntry():boolean {
    if (this.ID_LEHRER==CourseBookComponent.courseBook.idLehrer) {return true;}
    return false;
  }


}
