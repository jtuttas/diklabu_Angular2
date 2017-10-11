import {Component} from "@angular/core";

@Component({
  selector: 'diklabu',
  template:
  '<coursebook #courseBookComponent></coursebook>\n' +
  '  <hr/>\n' +
  '  <router-outlet name=\"sub\"></router-outlet>',
})

export class diklabuComponent {

}
