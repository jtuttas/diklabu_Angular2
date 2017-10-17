import {Component, EventEmitter, Input, Output, ViewContainerRef} from "@angular/core";
import {Course} from "./data/Course";

import {AppComponent} from "./app.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

import {Lernfeld} from "./data/Lernfeld";
import {MessageService} from "primeng/components/common/messageservice";
import {SelectItem} from "primeng/primeng";
import {Config} from "./data/Config";


@Component({
  selector: 'lfselect',
  template: '<strong>Lernfelder:</strong><br/>\n' +
  '<p-dropdown [autoWidth]="false" [options]="lfs" [(ngModel)]="selectedLF" placeholder="Lernfelder" [disabled]="compDisabled"></p-dropdown>\n',

})

export class LFSelectComponent{
  @Output() lfLoaded = new EventEmitter();


  public lfs:SelectItem[];
  public selectedLF="LF1";
  public compDisabled:boolean=true;


  public getLfNumber(s:string):number {
    for (var i=0;i<this.lfs.length;i++) {
      console.log( "test ("+s+") ist "+this.lfs[i].label);
      if (this.lfs[i].label==s) {
        return i;
      }
    }
    return -1;
  }


  constructor(http:HttpClient,private messageService: MessageService){


    // Make the HTTP request:
    http.get(Config.SERVER+"Diklabu/api/v1/noauth/lernfelder").subscribe(data => {
      // Read the result field from the JSON response.
      console.log("reviced ld:"+JSON.stringify(data));
      let lfd:any=data;
      this.lfs =  [];
      for (var i=0;i<lfd.length;i++) {
        this.lfs.push({label: lfd[i].id, value: lfd[i].id});
      }
      this.compDisabled=false;
      this.selectedLF=this.lfs[0].value;
      this.lfLoaded.emit();
    },

      (err: HttpErrorResponse) => {

        this.compDisabled=true;
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
          this.messageService.add({severity:'error', summary:'Fehler', detail:'Kann Lernfeldliste nicht vom Server laden! MSG='+err.error.message});
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.messageService.add({severity:'error', summary:'Fehler', detail:'Kann Lernfeldliste nicht vom Server laden! MSG='+err.name});
        }

    });
    console.log("Construktor CourseSelectComponent");
  }


  removeLf(excluded:string) {
    console.log(" Entferne LF Eintrag "+excluded+" Da bereits Note(n) vorhanden!");
    console.log(" Bisherige einträge:"+JSON.stringify(this.lfs));
    for (var j=0;j<this.lfs.length;j++) {
      if (this.lfs[j].label==excluded) {
        this.lfs.splice(j, 1);
        this.selectedLF=this.lfs[0].label;
        return;
      }
    }
  }

  getSelectedLernfeld() {
    return this.selectedLF;
  }


}
