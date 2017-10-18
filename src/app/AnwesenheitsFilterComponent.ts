import {Component, EventEmitter, Input, Output, ViewContainerRef} from "@angular/core";
import {Course} from "./data/Course";

import {AppComponent} from "./app.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

import {Lernfeld} from "./data/Lernfeld";
import {MessageService} from "primeng/components/common/messageservice";
import {SelectItem} from "primeng/primeng";
import {Config} from "./data/Config";
import {AnwesenheitsService} from "./services/AnwesenheitsService";
import {Termin} from "./data/Termin";


@Component({
  selector: 'afilter',
  template:
  '<div class="ui-g ui-g-12 special">' +
  '<div class="ui-md-1">' +
  '<strong>Filter 1</strong><br/>' +
  '<p-dropdown  (onChange)="OnChangeCal($event.value)"  [options]="filter" [(ngModel)]="selectedFilter1" placeholder="Filter"></p-dropdown>\n' +
  '</div>' +
  '<div class="ui-md-1">' +
  '<strong>Filter 2</strong><br/>' +
  '<p-dropdown (onChange)="OnChangeCal($event.value)"  [options]="filter" [(ngModel)]="selectedFilter2" placeholder="Filter"></p-dropdown>\n' +
  '</div>' +
  '</div>',
  styles: ['.special {text-align: left;}'],

})

export class AnwesenheitsFilterComponent {
  @Output() filterChanged = new EventEmitter();

  public filter: SelectItem[] = [];
  public selectedFilter1: Termin = new Termin("alle", -1);
  public selectedFilter2: Termin = new Termin("alle", -1);

  constructor(private anwesenheitsService: AnwesenheitsService, private messageService: MessageService) {
  }


  ngOnInit() {
    this.anwesenheitsService.getTermine().subscribe(data => {
        let t: Termin[] = data;
        let alle: Termin = new Termin("alle", -1);
        this.selectedFilter1 = alle;
        this.selectedFilter2 = alle;
        this.filter.push({label: "alle", value: alle});
        for (var i = 0; i < t.length; i++) {
          this.filter.push({label: t[i].NAME, value: t[i]})
        }
      },
      err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Fehler beim Laden der Terminliste: ' + err
        });

      });
  }

  OnChangeCal(e) {
    console.log("Drop Down CHanged!"+JSON.stringify(e));
    console.log ("Selected filter1="+JSON.stringify(this.selectedFilter1)+" filter2="+JSON.stringify(this.selectedFilter2));
    this.filterChanged.emit({filter1: this.selectedFilter1,filter2: this.selectedFilter2});
  }

}
