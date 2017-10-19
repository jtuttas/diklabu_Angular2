import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./LoginComponent";
import {CourseBookComponent} from "./CourseBookComponent";
import {ModuleWithProviders} from "@angular/core";
import {diklabuComponent} from "./diklabuComponent";
import {AuthenticationGuard} from "./authentication.guard";
import {VerlaufComponent} from "./VerlaufComponent";
import {AnwesenheitsComponent} from "./AnwesenheitsComponent";
import {NewVerlaufComponent} from "./NewVerlaufComponent";
import {TodayAnwesenheitsComponente} from "./TodayAnwesenheitsComponente";
import {FehlzeitenComponent} from "./FehlzeitenComponent";
import {NotenComponent} from "./NotenComponent";
import {BetriebeComponent} from "./BetriebeComponent";
import {PupilLoginComponent} from "./PupilLoginComponent";

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {path: 'login', component: LoginComponent},
  {
    path: 'diklabu', component: diklabuComponent, canActivate: [AuthenticationGuard], data: {roles: ['Admin','Lehrer']},

    children: [
      {path: 'verlauf', component: VerlaufComponent, outlet: 'sub'},
      {path: 'anwesenheit', component: AnwesenheitsComponent, outlet: 'sub'},
      {path: 'todayanwesenheit', component: TodayAnwesenheitsComponente, outlet: 'sub'},
      {path: 'fehlzeiten', component: FehlzeitenComponent, outlet: 'sub'},
      {path: 'noten', component: NotenComponent, outlet: 'sub'},
      {path: 'betriebe', component: BetriebeComponent, outlet: 'sub'}
    ]
  },
  {
    path: 'schueler', component: PupilLoginComponent, canActivate: [AuthenticationGuard], data: {roles: ['Schueler']},
  },
  {
    path: "**",
    redirectTo: 'login'
  }

];

export var routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
