import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {
  MdDatepickerModule, MaterialModule, MdNativeDateModule, MdButtonModule,
  MdCheckboxModule, MdDialogModule
} from '@angular/material';
import {DatepickerComponent} from './DatepickerComponent';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CourseSelectComponent} from "./CourseSelectComponent";
import {DurationPickerComponent} from "./DurationPickerComponent";
import {HttpClientModule} from "@angular/common/http";
import {LFSelectComponent} from "./LFSelectComponent";
import {NewVerlaufComponent} from "./NewVerlaufComponent";
import {HttpModule} from "@angular/http";
import {ListVerlaufComponent} from "./ListVerlaufComponent";
import 'hammerjs';
import {ConfirmDialog} from "./VerlaufDeleteDialog";
import {DialogsService} from "./DialogService";
import {TabComponent} from "./TabComponent";
import {CourseBookComponent} from "./CourseBookComponent";
import {SharedService} from "./services/SharedService";
import {AnwesenheitsComponent} from "./AnwesenheitsComponent";
import {HotTable, HotTableModule} from "ng2-handsontable";
import {PupilService} from "./services/PupilService";
import {DataTableModule, GrowlModule, SharedModule} from "primeng/primeng";
import {AnwesenheitsService} from "./services/AnwesenheitsService";


@NgModule({
  declarations: [
    AppComponent, DatepickerComponent, CourseSelectComponent, DurationPickerComponent, LFSelectComponent, NewVerlaufComponent
    , ListVerlaufComponent, ConfirmDialog, TabComponent, CourseBookComponent, AnwesenheitsComponent
  ],
  imports: [
    BrowserModule, NgbModule.forRoot(), FormsModule,
    MdDatepickerModule, MaterialModule, MdNativeDateModule, BrowserAnimationsModule
    ,HttpClientModule,HttpModule,MdButtonModule, MdCheckboxModule, MdDialogModule, MdButtonModule, DataTableModule, SharedModule,
    GrowlModule
  ],
  exports: [
    ConfirmDialog
  ],
  providers: [
    SharedService,DialogsService,AppComponent, PupilService, AnwesenheitsService
  ],
  entryComponents: [
    ConfirmDialog,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
