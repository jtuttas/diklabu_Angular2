import {Component, Input} from "@angular/core";
import {MailObject} from "./data/MailObject";
import {MailService} from "./services/MailService";
import {MessageService} from "primeng/components/common/messageservice";

@Component({
  selector: 'sendmail',
  styles: ['input {' +
  'width:100%;'+
  '}'+
    'textarea{width:100%;}'

  ],
  template:
    ' <p-dialog [header]="titel" [(visible)]="display" modal="modal" [closable]="true" [width]="500" appendTo="body"><br/>' +
    '<span class="ui-float-label">'+
    '<input id="to" type="text" pInputText [(ngModel)]="mail.to"/>'+
    '<label for="to">An:</label>'+
    '</span>'+
    '<div *ngIf="mail.cc.length>0"><br/> <span class="ui-float-label" >'+
    '<input id="cc" type="text" pInputText [(ngModel)]="mail.cc"/>'+
    '<label for="cc">CC:</label>'+
    '</span></div>'+
    '<div *ngIf="mail.bcc.length>0"><br/> <span class="ui-float-label" >'+
    '<input id="bcc" type="text"  pInputText [(ngModel)]="mail.bcc"/>'+
    '<label for="bcc">BCC:</label>'+
    '</span></div><br/>'+
    '<span class="ui-float-label">'+
    '<input id="subject" type="text" pInputText [(ngModel)]="mail.subject"/>'+
    '<label for="subject">Betreff</label>'+
    '</span><br/>'+
    '<strong>Inhalt</strong><br/>'+
    '<textarea pInputTextarea [(ngModel)]="mail.content"></textarea>'+
    '<br/>'+
    '        <p-footer>\n' +
    '            <button type="button" class="ui-button-success" pButton icon="fa-check" (click)="sendMail()" label="Absenden"></button>\n' +
    '            <button type="button" pButton icon="fa-close" (click)="display=false" label="Abbrechen"></button>\n' +
    '        </p-footer>\n' +
    '</p-dialog>'
})
export class MailDialog {
  @Input() mail: MailObject;

  private display:boolean=false;
  private titel:string="";

  constructor(private mailService:MailService,private messageService: MessageService) {}

  showDialog(titel:string) {
    this.titel=titel;
    this.display = true;
  }

  sendMail() {
    this.display=false;
    this.mailService.sendMail(this.mail).subscribe(answer => {
        console.log("Answer from Mailservice:"+JSON.stringify(answer));
        if (answer.success==false) {
          this.messageService.add({severity:'error', summary:'Fehler', detail: answer.msg});
          this.display=true;
        }
        else {
          this.messageService.add({severity:'info', summary:'Info', detail:'Mail erfolgreich versandt!'});
        }

      },
      err => {
        console.log("Error from Mailservice:"+err);
        this.messageService.add({severity:'error', summary:'Fehler', detail: err});
      });
  }
}
