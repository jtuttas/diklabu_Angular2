import {Component, Input, ViewChild} from '@angular/core';
import {Verlauf} from "./data/Verlauf";


/**
 * @title Basic tabs
 */
@Component({
  selector: 'tab',
  templateUrl: 'TabComponent.html',
})
export class TabComponent {

  @ViewChild('newVerlaufComponent') verlaufComponent;
  @ViewChild('listVerlaufComponent') listVerlaufComponent;

  newVerlauf(v:Verlauf) {
    console.log("Neuer Verlauf eintragen "+v.INHALT);
    this.listVerlaufComponent.addVerlauf(v);

  }

  editVerlauf(v:Verlauf) {
    this.verlaufComponent.setVerlauf(v);
  }
  ngAfterViewInit() {
    console.log("Tab  Init!");
  }

}
