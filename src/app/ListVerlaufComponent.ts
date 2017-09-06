import {Component, ElementRef, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {MdSort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Verlauf} from "./data/Verlauf";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ToastsManager} from "ng2-toastr";
import {AppComponent} from "./app.component";
import {CourseBook} from "./data/CourseBook";
import {ComponentChangedListener} from "./data/ComponentChangedListener";
import {DialogsService} from "./DialogService";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

/**
 * @title List Verlauf
 */
@Component({
  selector: 'listverlauf',
  styleUrls: ['ListVerlaufComponent.css'],
  templateUrl: 'ListVerlaufComponent.html',
})
export class ListVerlaufComponent {
  @Input() listener: ComponentChangedListener;

  displayedColumns = ['Datum', 'LK', 'LF', 'Stunde', 'Inhalt', 'Bemerkungen', 'Lernsituation'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  http: HttpClient;
  compDisabled = true;
  selectedVerlauf:Verlauf;
  public result: any;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('filter') filter: ElementRef;


  constructor(http: HttpClient, public toastr: ToastsManager, vcr: ViewContainerRef, private dialogsService: DialogsService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.http = http;

  }

  ngOnInit() {

    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        console.log("key up event");
        this.dataSource.filter = this.filter.nativeElement.value;
      });
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

  getSelected():Verlauf {
    return this.selectedVerlauf;
  }

  addVerlauf(v:Verlauf):void {
    this.exampleDatabase.add(v);
  }

  delete(v:Verlauf) {
    console.log("Delete Verlauf ID=" + v.ID);
    this.dialogsService
      .confirm('Verlaufseintrag löschen?', 'Wollen Sie den Eintrag ' + v.ID_LERNFELD + ' Stunde ' + v.STUNDE + ' am ' + CourseBook.toReadbleString(new Date(v.DATUM)) + ' löschen ?')
      .subscribe(res => {
          if (res) {
            console.log("OK löschen");
            this.confimedDelete(v);
          }
        }
      );
  }

  confimedDelete(v:Verlauf) {
    this.exampleDatabase.delete(v);
    this.http.delete(AppComponent.SERVER + "/Diklabu/api/v1/verlauf/" + v.ID).subscribe(data => {
        // Read the result field from the JSON response.
        //this.lfs = data;
        console.log("Delete Verlauf=" + JSON.stringify(data));
      },

      (err: HttpErrorResponse) => {

        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
          this.toastr.error('Kann Verlaufselement nicht löschen! MSG=' + err.error.message, 'Fehler!');
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          this.toastr.error('Kann Verlaufelement nicht löschen! (' + err.name + ')', 'Fehler!');
        }

      });
  }


  edit(v:Verlauf) {
    this.selectedVerlauf=v;
    console.log("edit"+v.ID);
    this.listener.componentChanged(this);
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

  public delete(v:Verlauf) {
    for (let i = 0; i < this.data.length; i++) {
      if (v.ID == this.data[i].ID) {
        console.log("Eintrag gefunden");
        this.data.splice(i,1);
        const copiedData = this.data.slice();
        this.dataChange.next(copiedData);

        return;
      }
    }

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
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData: Verlauf[] = [];
  renderedData: Verlauf[] = [];

  constructor(private _exampleDatabase: ExampleDatabase, private _sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Verlauf[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
    ];

    console.log("connect() ")

    /*
    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  */
    return Observable.merge(...displayDataChanges).map(() => {
      // Filter
      this.filteredData = this._exampleDatabase.data.slice().filter((item: Verlauf) => {
        let searchStr = (item.STUNDE + item.ID_LERNFELD+item.INHALT+item.BEMERKUNG+item.AUFGABE+item.ID_LEHRER).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
      const sortedData= this.getSortedData(this.filteredData);
      return sortedData;
    });

  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData(data:Verlauf[]): Verlauf[] {

    if (!this._sort.active || this._sort.direction == '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'Datum':
          var a1 = new Date (a.DATUM);
          var b1 = new Date (b.DATUM);
          [propertyA, propertyB] = [a1.getTime(), b1.getTime()];
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
