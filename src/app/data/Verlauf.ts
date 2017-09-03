export class Verlauf {
  AUFGABE:string="ls";
  BEMERKUNG:string="bem";
  DATUM:Date;
  ID:number=2;
  ID_KLASSE:number=12;
  ID_LEHRER:string="TU";
  ID_LERNFELD:string="LF12";
  INHALT:string="kein Inhalt";
  STUNDE:string="00";
  kw:string="02";
  wochentag:string="Mo.";

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
