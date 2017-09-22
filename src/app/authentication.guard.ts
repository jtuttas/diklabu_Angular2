import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {CourseBookComponent} from "./CourseBookComponent";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (CourseBookComponent.courseBook.auth_token) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
