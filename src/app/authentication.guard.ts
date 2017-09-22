import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (localStorage.getItem('auth_token')) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
