import {Component, Input} from "@angular/core";
import {CourseService} from "./services/CourseService";
import {CourseBookComponent} from "./CourseBookComponent";

@Component({
  selector: 'courseinfo',
  styles: ['textarea{width:100%;}'],
  template:
  ' <p-dialog [header]="titel" [(visible)]="display" modal="modal" [closable]="true" appendTo="body">' +
  '<strong>{{courseTitel}}</strong>' +
  '<h3>Klassenlehrer</h3>' +
  '<strong>{{lvname}} {{lnname}}</strong>' +
  ' (<a [href]="mailto">{{lemail}}</a>)' +
  '<h3>Klassenbemerkung</h3>' +
  '<textarea pInputTextarea [(ngModel)]="bem"></textarea>' +
  '<p-footer>\n' +
'            <button type="button" class="ui-button-success" pButton icon="fa-check" (click)="bemChanged()" label="Ändern"></button>\n' +
'        </p-footer>\n' +
  '</p-dialog>'
})
export class CourseInfoDialog {

  public display: boolean = false;
  public titel: string = "";
  public courseTitel:string = "";
  public bem: string = "";
  public lvname: string = "";
  public lnname: string = "";
  public lemail: string = "";
  public mailto: string = "";

  constructor(private courseService: CourseService) {}

  showDialog(titel: string,courseTitel: string) {
    this.titel = titel;
    this.display = true;
    this.courseTitel =courseTitel;
  }

  bemChanged() {
    this.display=false;
    this.courseService.setCourseInfo(CourseBookComponent.courseBook.course.id,this.bem).subscribe(
      data => {
        console.log("Set Course Info Responce:"+JSON.stringify(data));
      },
      err => {
        console.log ("Set Course Infoi Error:"+err);
      }
    );
  }
}
