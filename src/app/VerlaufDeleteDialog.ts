import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MailObject} from "./data/MailObject";
import {MailService} from "./services/MailService";
import {MessageService} from "primeng/components/common/messageservice";
import {Verlauf} from "./data/Verlauf";

@Component({
  selector: 'deleteverlauf',
  styles: [  ],
  template:
  ' <p-dialog [header]="titel" [(visible)]="display" modal="modal" [closable]="true" [width]="300" appendTo="body"><br/>' +
  '<strong>Datum: </strong>{{verlauf.DATUM |  date: "dd.MM.yyyy"}}<br/>'+
  '<strong>Stunde: </strong>{{verlauf.STUNDE}}<br/>'+
  '<strong>Lernfeld: </strong>{{verlauf.ID_LERNFELD}}<br/>'+
  '<strong>Inhalt: </strong>{{verlauf.INHALT}}<br/>'+
  '<br/>'+
  '        <p-footer>\n' +
  '            <button type="button" class="ui-button-success" pButton icon="fa-check" (click)="delete()" label="Löschen"></button>\n' +
  '            <button type="button" pButton icon="fa-close" (click)="display=false" label="Abbrechen"></button>\n' +
  '        </p-footer>\n' +
  '</p-dialog>'
})
export class VerlaufDeleteDialog {
  @Output() deleteVerlauf = new EventEmitter();

  public display:boolean=false;
  public titel:string="";
  public verlauf:Verlauf=new Verlauf("","","",0,"");

  constructor() {}

  showDialog(titel:string, v:Verlauf) {
    this.verlauf=v;
    this.titel=titel;
    this.display = true;
  }

  delete() {
    this.display=false;
    this.deleteVerlauf.emit(this.verlauf);
  }
}
