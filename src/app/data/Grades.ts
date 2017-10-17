export class Grade {
  ID_KLASSEN_ALL:number;
  ID_LERNFELD: string;
  ID_LERNFELD_ORG: string
  ID_LK:string;
  ID_SCHUELER:number;
  ID_SCHUELER_ORG: number;
  ID_SCHULJAHR:number;
  WERT:string;
  nameLernfeld:string;
}

export class Grades {
  msg: string="";
  success: boolean=true;
  warning: boolean;
  warningMsg: string[];
  noten: Grade[];
  schuelerID: number =0;
}
