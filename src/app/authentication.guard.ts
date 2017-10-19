import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {CourseBookComponent} from "./CourseBookComponent";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    let roles = route.data["roles"] as Array<string>;
    console.log("AuthGuard canActivate! roles="+JSON.stringify(roles));
    if (CourseBookComponent.courseBook.auth_token) {
      console.log("AuthGuard canActivate! Result "+(roles == null || roles.indexOf("Admin")!=-1));
      return (roles == null || roles.indexOf("Admin") != -1 || roles.indexOf("Schueler") != -1);
    }
    this.router.navigate(['/login']);
    return false;
  }
}
