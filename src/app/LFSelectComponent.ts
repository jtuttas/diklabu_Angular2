import {Component, Input, ViewContainerRef} from "@angular/core";
import {Course} from "./data/Course";
import {ComponentChangedListener} from "./data/ComponentChangedListener";
import {AppComponent} from "./app.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ToastsManager} from "ng2-toastr";
import {Lernfeld} from "./data/Lernfeld";


@Component({
  selector: 'lfselect',
  templateUrl: './LFSelectComponent.html',
  styleUrls: ['./LFSelectComponent.css']
})

export class LFSelectComponent{
  @Input() listner: ComponentChangedListener;

  public lfid:number=0;
  public lfs;
  public compDisabled:boolean=true;


  constructor(http:HttpClient,public toastr: ToastsManager, vcr: ViewContainerRef){
    this.toastr.setRootViewContainerRef(vcr);

    // Make the HTTP request:
    http.get(AppComponent.SERVER+"Diklabu/api/v1/noauth/lernfelder").subscribe(data => {
      // Read the result field from the JSON response.
      this.lfs = data;
      if (this.listner != undefined) {
        this.listner.componentInit();
      }
      this.compDisabled=false;
    },

      (err: HttpErrorResponse) => {

        this.compDisabled=true;
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
          this.toastr.error('Kann Lernfeldliste nicht vom Server laden! MSG='+err.error.message, 'Fehler!');
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.toastr.error('Kann Lernfeldliste nicht vom Server laden! ('+err.name+')', 'Fehler!');
        }

    });
    console.log("Construktor CourseSelectComponent");
  }


  getSelectedLernfeld():Lernfeld {
    return this.lfs[this.lfid];
  }

}
