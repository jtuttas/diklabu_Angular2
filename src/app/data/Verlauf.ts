import {AppComponent} from "../app.component";
import {CourseBookComponent} from "../CourseBookComponent";

export class Verlauf {
  AUFGABE:string;
  BEMERKUNG:string;
  DATUM:Date;
  ID:number;
  ID_KLASSE:number;
  ID_LEHRER:string;
  ID_LERNFELD:string;
  INHALT:string;
  STUNDE:string;
  kw:string;
  wochentag:string;

  static wochentage=["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."];

  constructor(inhalt:string,stunde:string,id_lehrer,id_klasse:number,d:Date) {
    this.INHALT=inhalt;
    this.STUNDE=stunde;
    this.ID_LEHRER=id_lehrer;
    this.ID_KLASSE=id_klasse;
    this.DATUM=d;
    this.wochentag=Verlauf.wochentage[d.getDay()];
    console.log("Neuer Verlauf "+d.getDay()+" Wochentag="+this.wochentag);
  }

  isOwnEntry():boolean {
    if (this.ID_LEHRER==CourseBookComponent.courseBook.idLehrer) {return true;}
    return false;
  }

  euqals(v:Verlauf):boolean {

    let vd:Date = new Date(v.DATUM);
    let d:Date = new Date(this.DATUM);
    //console.log("v.DATUM="+vd.getTime()+" this.DATUM="+d.getTime());

    if (vd.getTime()==d.getTime() && this.STUNDE==v.STUNDE && this.ID_KLASSE==v.ID_KLASSE && this.ID_LEHRER==v.ID_LEHRER && this.ID_LERNFELD==v.ID_LERNFELD) {
      return true;
    }
    else {
      return false;
    }
  }


}
