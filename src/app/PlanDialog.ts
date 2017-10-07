import {Component, Input} from "@angular/core";

@Component({
  selector: 'plan',
  styles: [],
  template:
  ' <p-dialog [header]="titel" [(visible)]="display" modal="modal" [closable]="true" appendTo="body"><br/>' +
    '<p [innerHtml]="content"></p>'+
  '</p-dialog>'
})
export class PlanDialog {

  public display: boolean = false;
  public titel: string = "";
  public content: string="";

  showDialog(titel:string,content) {
    this.titel=titel;
    this.content=content;
    this.display = true;
  }
}
