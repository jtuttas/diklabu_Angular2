import {Component, EventEmitter, Input, Output, ViewContainerRef} from "@angular/core";
import {Course} from "./data/Course";

import {AppComponent} from "./app.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

import {Lernfeld} from "./data/Lernfeld";
import {MessageService} from "primeng/components/common/messageservice";


@Component({
  selector: 'lfselect',
  templateUrl: './LFSelectComponent.html',
  styleUrls: ['./LFSelectComponent.css']
})

export class LFSelectComponent{
  @Output() lfLoaded = new EventEmitter();

  public lfid:number=0;
  public lfs;
  public compDisabled:boolean=true;

  public getLfNumber(s:string):number {
    for (var i=0;i<this.lfs.length;i++) {
      console.log( "test ("+s+") ist "+this.lfs[i].BEZEICHNUNG);
      if (this.lfs[i].BEZEICHNUNG==s) {
        return i;
      }
    }
    return -1;
  }

  constructor(http:HttpClient,private messageService: MessageService){


    // Make the HTTP request:
    http.get(AppComponent.SERVER+"Diklabu/api/v1/noauth/lernfelder").subscribe(data => {
      // Read the result field from the JSON response.
      this.lfs = data;
      this.compDisabled=false;
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


  getSelectedLernfeld():Lernfeld {
    return this.lfs[this.lfid];
  }

}
