import {Component} from "@angular/core";
import {MenuItem} from "primeng/primeng";
import {Http, Headers} from "@angular/http";
import {CourseBookComponent} from "./CourseBookComponent";
import {AppComponent} from "./app.component";
import {CourseBook} from "./data/CourseBook";
import {HttpErrorResponse} from "@angular/common/http";
import {DokuService} from "./services/DokuService";
import {Observable} from "rxjs/Observable";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'doku',
  styles: ['.doku{position: absolute; top: 4px; right: 4px;} img {padding-left: 30px;}'],
  template: '<div *ngIf="dokuService.isVisible()" class="doku" ><img [src]="imgSrc">' +
  '<p-splitButton  label="Doku" icon="fa-check" (onClick)="create()" [model]="items" ></p-splitButton></div>'
})
export class DokuComponent {
  private type: string = "pdf";
  private dokufilter1 = "alle";
  private dokufilter2 = "alle";
  private anwfilter1 = "0";
  private anwfilter2 = "0";

  constructor(public dokuService:DokuService) {
  }

  public imgSrc: string = "../assets/pdf.png";
  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'pdf', icon: 'fa-file-pdf-o', command: () => {
        this.createPdf();
      }
      },
      {
        label: 'xlsx', icon: 'fa-file-excel-o', command: () => {
        this.createXlsx();
      }
      }
    ];
  }

  createPdf() {
    console.log("Create PDF");
    this.imgSrc = "../assets/pdf.png";
    this.type = "pdf";
  }

  createXlsx() {
    console.log("Create Xlsx");
    this.imgSrc = "../assets/Excel.png";
    this.type = "csv"
  }

  create() {
    console.log("Create " + this.type);

    var body = "auth_token=" + CourseBookComponent.courseBook.auth_token;
    body += "&idklasse=" + CourseBookComponent.courseBook.course.id;
    body += "&from=" + CourseBook.toSQLString(CourseBookComponent.courseBook.fromDate);
    body += "&to=" + CourseBook.toSQLString(CourseBookComponent.courseBook.toDate);
    body += "&dokufilter1=" + this.dokufilter1;
    body += "&dokufilter2=" + this.dokufilter2;
    body += "&anwfilter1=" + this.anwfilter1;
    body += "&anwfilter2=" + this.anwfilter2;
    body += "&type=" + this.type;
    body += "&cmd="+CourseBookComponent.courseBook.view;
    console.log("body-->" + body);
    this.dokuService.getDoku(body).subscribe(res => {
      if (this.type=="pdf") {
        let blob = new Blob([res], {
          type: 'application/pdf' // must match the Accept type
        });
        let filename = CourseBookComponent.courseBook.course.KNAME+"_"+CourseBookComponent.courseBook.view+"_"+CourseBook.toSQLString(CourseBookComponent.courseBook.fromDate)+"_"+CourseBook.toSQLString(CourseBookComponent.courseBook.toDate)+".pdf";
        FileSaver.saveAs(blob, filename);
      }
      else {
        let blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // must match the Accept type
        });
        let filename = CourseBookComponent.courseBook.course.KNAME+"_"+CourseBookComponent.courseBook.view+"_"+CourseBook.toSQLString(CourseBookComponent.courseBook.fromDate)+"_"+CourseBook.toSQLString(CourseBookComponent.courseBook.toDate)+".xlsx";
        FileSaver.saveAs(blob, filename);
      }

    })
  }

}
