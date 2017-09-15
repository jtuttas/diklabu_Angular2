import {Component, Input, ViewChild} from '@angular/core';
import {ComponentChangedListener} from "./data/ComponentChangedListener";

/**
 * @title Basic tabs
 */
@Component({
  selector: 'tab',
  templateUrl: 'TabComponent.html',
})
export class TabComponent implements ComponentChangedListener{
  @Input() listener: ComponentChangedListener;

  @ViewChild('newVerlaufComponent') verlaufComponent;
  @ViewChild('listVerlaufComponent') listVerlaufComponent;

  ngAfterViewInit() {
    console.log("Tab  Init!");
  }

  componentChanged(c:any): void {
    console.log ("Tab Component changed");
    if (c==this.listVerlaufComponent) {
      // Gewählten Verlauf in Verlaufskomponente anzeigen
      this.verlaufComponent.setVerlauf(this.listVerlaufComponent.selectedVerlauf);
    }
    else if (c==this.verlaufComponent) {
      // neuen Verlauf in ListVerlaufkomponente hinzufügen
      this.listVerlaufComponent.addVerlauf(this.verlaufComponent.verlauf);

    }
  }

  componentInit(c:any){
    console.log ("Tab Component init"+this.listVerlaufComponent);
    if (c==this.listVerlaufComponent) {
      this.listener.componentInit(this)
    }
  }


  updateView() {
    this.listVerlaufComponent.getVerlauf();
  }
}
