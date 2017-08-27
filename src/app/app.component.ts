import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  name =  'Tuttas!';
  title = 'app';

  @ViewChild('fromDate') fromDate;



  constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.toastr.success('You are awesome!', 'Success!');
  }

  doNumer(t1: number, t2: number): number {
    return t1 + t2;
  }

  testClick() {
    console.log('from Date='+this.fromDate.d.toString());
  }
}
