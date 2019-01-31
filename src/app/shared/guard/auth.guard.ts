import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // Inject Router so we can hand off the user to the Login Page
  constructor(private router: Router) {}

  /**
   * Checks if the session variable x-auth is available, if so the guard let´s pass the user
   *
   * @param next
   * @param state
   */
  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if ( sessionStorage.getItem('x-auth') ){
      // Token from the LogIn is avaiable, so the user can pass to the route
      return true
    } else  {
      // Token from the LogIn is not avaible because something went wrong or the user wants to go over the url to the site
      // Hands the user to the Landing page
      alert("Sie sind momentan nicht eingeloggt. Bitte loggen Sie sich bevor besuch dieser Seite ein!");
      this.router.navigate( [""] );
      return false

    }

  }
}
