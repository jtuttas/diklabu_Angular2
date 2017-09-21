import {Anwesenheitseintrag} from "./Anwesenheitseintrag";

export class Anwesenheit {
  anzahlVerspaetungen: number;
  eintraege : Anwesenheitseintrag[];
  fehltageEntschuldigt : Anwesenheitseintrag[];
  fehltageUnentschuldigt : Anwesenheitseintrag[];
  id_Schueler: number;
  parseErrors : Anwesenheitseintrag[];
  summeFehltage: number;
  summeFehltageEntschuldigt: number;
  summeMinutenVerspaetungen: number;
  summeMinutenVerspaetungenEntschuldigt: number;


}
