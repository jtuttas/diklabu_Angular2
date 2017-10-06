import {Component, Input, ViewChild} from '@angular/core';
import {Verlauf} from "./data/Verlauf";
import {CourseBookComponent} from "./CourseBookComponent";


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

  private views:string[]=["Anwesenheit","Verlauf"];
  selectedIndex:number=0;

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


  tabIndexChanged() {
    CourseBookComponent.courseBook.view=this.views[this.selectedIndex];
    console.log("Tab Index changed: "+this.selectedIndex+" current View is "+CourseBookComponent.courseBook.view);

  }

}
