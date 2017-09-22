import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./LoginComponent";
import {CourseBookComponent} from "./CourseBookComponent";
import {ModuleWithProviders} from "@angular/core";
import {diklabuComponent} from "./diklabuComponent";
import {AuthenticationGuard} from "./authentication.guard";

const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {path: 'login', component: LoginComponent},
  {path: 'diklabu',component: diklabuComponent, canActivate: [AuthenticationGuard] },
  {
    path: "**",
    redirectTo: 'login'
  }

];

export var routing: ModuleWithProviders= RouterModule.forRoot(appRoutes);
