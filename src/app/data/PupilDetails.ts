import {Course} from "./Course";

class Ausbilder {
  EMAIL: string="";
  FAX: string = "";
  ID: number = -1;
  ID_BETRIEB: number = -1;
  NNAME: string = "";
  TELEFON: string = "";
}

class Betrieb {
  ID: number = -1;
  NAME: string = "";
  ORT: string = "";
  PLZ: string = "";
  STRASSE: string = "";
}

export class PupilDetails {
  ID_MMBBS: number = -1;
  abgang: string = "";
  ausbilder: Ausbilder = new Ausbilder();
  betrieb: Betrieb = new Betrieb();
  email: string = "";
  gebDatum: string = "";
  id: number = -1;
  klassen: Course[] = new Array();
  name: string = "";
  vorname: string = "";
  info: string = "";
}
