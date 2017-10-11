import {Component, Input, ViewChild} from '@angular/core';
import {Verlauf} from "./data/Verlauf";


/**
 * @title Basic tabs
 */
@Component({
  selector: 'verlauf',
  template: '<newverlauf #newVerlaufComponent (newVerlauf)="newVerlauf($event)"></newverlauf>\n' +

  '    <listverlauf #listVerlaufComponent (editVerlauf)="editVerlauf($event)"></listverlauf>',
})
export class VerlaufComponent {

  @ViewChild('newVerlaufComponent') verlaufComponent;
  @ViewChild('listVerlaufComponent') listVerlaufComponent;

  constructor() {
    console.log ("construktor verlaufkomponente");
  }

  newVerlauf(v:Verlauf) {
    //console.log("Neuer Verlauf eintragen "+v.INHALT);
    this.listVerlaufComponent.addVerlauf(v);

  }

  editVerlauf(v:Verlauf) {
    console.log(v.constructor.name);
    console.log("editVerlauf Revices:"+JSON.stringify(v));
    let ve:Verlauf=new Verlauf(v.INHALT,v.STUNDE,v.ID_LEHRER,v.ID_KLASSE,v.DATUM);
    ve.BEMERKUNG=v.BEMERKUNG;
    ve.AUFGABE=v.AUFGABE;
    ve.wochentag=v.wochentag;
    ve.ID_LERNFELD=v.ID_LERNFELD;
    ve.kw=v.kw;
    this.verlaufComponent.setVerlauf(ve);
  }


}
