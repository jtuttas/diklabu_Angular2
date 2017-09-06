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
import {ToastModule} from 'ng2-toastr/ng2-toastr';
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


@NgModule({
  declarations: [
    AppComponent, DatepickerComponent, CourseSelectComponent, DurationPickerComponent, LFSelectComponent, NewVerlaufComponent
    , ListVerlaufComponent, ConfirmDialog
  ],
  imports: [
    BrowserModule, NgbModule.forRoot(), FormsModule,
    MdDatepickerModule, MaterialModule, MdNativeDateModule, BrowserAnimationsModule,ToastModule.forRoot()
    ,HttpClientModule,HttpModule,MdButtonModule, MdCheckboxModule, MdDialogModule, MdButtonModule
  ],
  exports: [
    ConfirmDialog
  ],
  providers: [
    DialogsService
  ],
  entryComponents: [
    ConfirmDialog,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
