import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {MdSort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {Verlauf} from "./data/Verlauf";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ToastsManager} from "ng2-toastr";
import {AppComponent} from "./app.component";
import {CourseBook} from "./data/CourseBook";

/**
 * @title List Verlauf
 */
@Component({
  selector: 'listverlauf',
  styleUrls: ['ListVerlaufComponent.css'],
  templateUrl: 'ListVerlaufComponent.html',
})
export class ListVerlaufComponent {

  displayedColumns = ['Datum', 'LK', 'LF', 'Stunde', 'Inhalt', 'Bemerkungen', 'Lernsituation'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  http: HttpClient;
  compDisabled = true;

  @ViewChild(MdSort) sort: MdSort;

  constructor(http: HttpClient, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.http = http;

  }

  ngOnInit() {

    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort);
  }

  public getVerlauf(): void {
    // Make the HTTP request:
    console.log("URL="+AppComponent.SERVER + "/Diklabu/api/v1/verlauf/" + AppComponent.courseBook.course.KNAME + "/" + CourseBook.toSQLString(AppComponent.courseBook.fromDate) + "/" + CourseBook.toSQLString(AppComponent.courseBook.toDate));
    this.http.get(AppComponent.SERVER + "/Diklabu/api/v1/verlauf/" + AppComponent.courseBook.course.KNAME + "/" + CourseBook.toSQLString(AppComponent.courseBook.fromDate) + "/" + CourseBook.toSQLString(AppComponent.courseBook.toDate)).subscribe(data => {
        // Read the result field from the JSON response.
        //this.lfs = data;
        console.log("Verlauf=" + JSON.stringify(data));
        this.exampleDatabase = new ExampleDatabase();
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort);
        this.exampleDatabase.setData(data);
        this.compDisabled = false;
      },

      (err: HttpErrorResponse) => {

        this.compDisabled = true;
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
          this.toastr.error('Kann Verlauf nicht vom Server laden! MSG=' + err.error.message, 'Fehler!');
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.toastr.error('Kann Verlauf nicht vom Server laden! (' + err.name + ')', 'Fehler!');
        }

      });
  }

  addVerlauf(v:Verlauf):void {
    this.exampleDatabase.add(v);
  }
}


/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Verlauf[]> = new BehaviorSubject<Verlauf[]>([]);

  get data(): Verlauf[] {
    return this.dataChange.value;
  }

  public setData(dat: any) {
    for (let i = 0; i < dat.length; i++) {
      const copiedData = this.data.slice();
      //console.log("Push:" + JSON.stringify(dat[i]));
      copiedData.push(<Verlauf>dat[i]);
      this.dataChange.next(copiedData);
    }
  }

  public add(v:Verlauf) {
    for (let i = 0; i < this.data.length; i++) {
      if (v.euqals(this.data[i])) {
        console.log("Eintrag gefunden");
        const copiedData = this.data.slice();
        copiedData[i]=<Verlauf>v;
        this.dataChange.next(copiedData);
        return;
      }
    }
    console.log("neuer Eintrag");
    const copiedData = this.data.slice();
    copiedData.push(<Verlauf>v);
    this.dataChange.next(copiedData);
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  constructor(private _exampleDatabase: ExampleDatabase, private _sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Verlauf[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.mdSortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData(): Verlauf[] {
    const data = this._exampleDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'Datum':
          [propertyA, propertyB] = [a.DATUM.toTimeString(), b.DATUM.toTimeString()];
          break;
        case 'LK':
          [propertyA, propertyB] = [a.ID_LEHRER, b.ID_LEHRER];
          break;
        case 'LF':
          [propertyA, propertyB] = [a.ID_LERNFELD, b.ID_LERNFELD];
          break;
        case 'Stunde':
          [propertyA, propertyB] = [a.STUNDE, b.STUNDE];
          break;
        case 'Inhalt':
          [propertyA, propertyB] = [a.INHALT, b.INHALT];
          break;
        case 'Bemerkungen':
          [propertyA, propertyB] = [a.BEMERKUNG, b.BEMERKUNG];
          break;
        case 'Lernsituation':
          [propertyA, propertyB] = [a.AUFGABE, b.AUFGABE];
          break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
