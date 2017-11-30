import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import {DatepickerComponent} from './DatepickerComponent';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CourseSelectComponent} from "./CourseSelectComponent";
import {DurationPickerComponent} from "./DurationPickerComponent";
import {HttpClientModule} from "@angular/common/http";
import {LFSelectComponent} from "./LFSelectComponent";
import {NewVerlaufComponent} from "./NewVerlaufComponent";
import {HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {ListVerlaufComponent} from "./ListVerlaufComponent";
import 'hammerjs';



import {CourseBookComponent} from "./CourseBookComponent";
import {SharedService} from "./services/SharedService";
import {AnwesenheitsComponent} from "./AnwesenheitsComponent";
import {PupilService} from "./services/PupilService";
import {
  ButtonModule, CalendarModule, DataGridModule, DataListModule, DataTableModule, DialogModule, FileUploadModule,
  GrowlModule,
  InputTextareaModule,
  InputTextModule,
  MenuModule, OrderListModule, PanelModule, PasswordModule, PickListModule, ProgressSpinnerModule,
  SharedModule, SplitButtonModule, TieredMenuModule, TooltipModule
} from "primeng/primeng";
import {AnwesenheitsService} from "./services/AnwesenheitsService";
import {LoginComponent} from "./LoginComponent";
import {LoginService} from "./services/LoginService";
import {routing} from "./Routing";
import {diklabuComponent} from "./diklabuComponent";
import {AuthenticationGuard} from "./authentication.guard";

import {VerlaufsService} from "./services/VerlaufsService";
import {MailService} from "./services/MailService";
import {MailDialog} from "./MailDialog";
import {PupilDetailService} from "./services/PupilDetailService";
import {PupilDetailDialog} from "./PupilDetailDialog";
import {PupilImageComponent} from "./PupilImageComponent";
import {DokuComponent} from "./DokuComponent";
import {DokuService} from "./services/DokuService";
import {CourseService} from "./services/CourseService";
import {PlanDialog} from "./PlanDialog";
import {CourseInfoDialog} from "./CourseInfoDialog";
import {MenuComponent} from "./MenuComponent";
import {VerlaufComponent} from "./VerlaufComponent";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {VerlaufDeleteDialog} from "./VerlaufDeleteDialog";
import {TodayAnwesenheitsComponente} from "./TodayAnwesenheitsComponente";
import {FehlzeitenComponent} from "./FehlzeitenComponent";
import {NotenComponent} from "./NotenComponent";
import {NotenService} from "./services/NotenService";
import {AnwesenheitsFilterComponent} from "./AnwesenheitsFilterComponent";
import {BetriebeComponent} from "./BetriebeComponent";
import {PupilLoginComponent} from "./PupilLoginComponent";
import {LoaderComponent} from "./loader/loader.component";
import {LoaderService} from "./loader/loader.service";
import {HttpService} from "./loader/HttpService";
import {httpServiceFactory} from "./loader/http-service.factory";
import {KurszugehoerigkeitComponent} from "./KurszugehoerigkeitComponent";




@NgModule({
  declarations: [
    AppComponent, DatepickerComponent, CourseSelectComponent, DurationPickerComponent, LFSelectComponent, NewVerlaufComponent
    , ListVerlaufComponent,   CourseBookComponent, AnwesenheitsComponent, LoginComponent,
    diklabuComponent,  MailDialog, PupilDetailDialog, PupilImageComponent, DokuComponent, PlanDialog,MenuComponent,
    CourseInfoDialog, VerlaufComponent, VerlaufDeleteDialog, TodayAnwesenheitsComponente,
    FehlzeitenComponent, NotenComponent, AnwesenheitsFilterComponent, BetriebeComponent,PupilLoginComponent,
    LoaderComponent, KurszugehoerigkeitComponent
  ],
  imports: [
    BrowserModule, NgbModule.forRoot(), FormsModule,
    BrowserAnimationsModule
    ,HttpClientModule,HttpModule, DataTableModule, SharedModule,
    GrowlModule,routing, DialogModule, ButtonModule, InputTextModule,
    InputTextareaModule, FileUploadModule,SplitButtonModule,TooltipModule,MenuModule,PasswordModule, CalendarModule, DropdownModule,
    DataListModule, OrderListModule, TieredMenuModule, DataGridModule, PanelModule, ProgressSpinnerModule, ProgressSpinnerModule,
    PickListModule
  ],
  exports: [

  ],
  providers: [
    SharedService,AppComponent, PupilService, AnwesenheitsService, LoginService, AuthenticationGuard, VerlaufsService,
    MailService,  PupilDetailService, DokuService, CourseService, NotenService,
    LoaderService,
    {
      provide: HttpService,
      useFactory: httpServiceFactory,
      deps: [XHRBackend, RequestOptions, LoaderService ]
    }
  ],
  entryComponents: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
