import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {
  MdDatepickerModule, MdNativeDateModule, MdButtonModule,
  MdCheckboxModule, MdDialogModule, MdSelectModule, MdTabsModule, MdTableModule, MdSort, MdSortModule, MdInputModule
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
import {PupilService} from "./services/PupilService";
import {
  ButtonModule, DataTableModule, DialogModule, GrowlModule, InputTextareaModule, InputTextModule,
  SharedModule
} from "primeng/primeng";
import {AnwesenheitsService} from "./services/AnwesenheitsService";
import {LoginComponent} from "./LoginComponent";
import {LoginService} from "./services/LoginService";
import {routing} from "./Routing";
import {diklabuComponent} from "./diklabuComponent";
import {AuthenticationGuard} from "./authentication.guard";
import {logoutComponent} from "./logoutComponent";
import {VerlaufsService} from "./services/VerlaufsService";
import {MailService} from "./services/MailService";
import {MailDialog} from "./MailDialog";
import {PupilDetailService} from "./services/PupilDetailService";
import {PupilDetailDialog} from "./PupilDetailDialog";


@NgModule({
  declarations: [
    AppComponent, DatepickerComponent, CourseSelectComponent, DurationPickerComponent, LFSelectComponent, NewVerlaufComponent
    , ListVerlaufComponent, ConfirmDialog, TabComponent, CourseBookComponent, AnwesenheitsComponent, LoginComponent,
    diklabuComponent, logoutComponent, MailDialog, PupilDetailDialog
  ],
  imports: [
    BrowserModule, NgbModule.forRoot(), FormsModule,
    MdDatepickerModule,  MdNativeDateModule, BrowserAnimationsModule
    ,HttpClientModule,HttpModule,MdButtonModule, MdCheckboxModule, MdDialogModule, MdButtonModule, DataTableModule, SharedModule,
    GrowlModule,routing, MdSelectModule, MdTableModule, MdTabsModule, MdSortModule, MdInputModule, DialogModule, ButtonModule, InputTextModule,
    InputTextareaModule
  ],
  exports: [
    ConfirmDialog
  ],
  providers: [
    SharedService,DialogsService,AppComponent, PupilService, AnwesenheitsService, LoginService, AuthenticationGuard, VerlaufsService, MdSort,
    MailService,  PupilDetailService
  ],
  entryComponents: [
    ConfirmDialog,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
