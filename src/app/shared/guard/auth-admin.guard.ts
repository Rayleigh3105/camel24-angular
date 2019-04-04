import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {
    // Inject Router so we can hand off the user to the Login Page
    constructor(private router: Router, private $auth: AuthService) {
    }

    /**
     * Get´s current User from Service and checks if he is Admin
     *
     * @param next
     * @param state
     */
    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {

        let result: boolean = false;
        await this.$auth.getCurrentUser()
            .then(user => {
                if (user.role === 'Admin') {
                    result = true;
                } else {
                    alert('Ups... nur Administratoren dürfen diese Seite aufrufen.!');
                    this.router.navigate(['']);
                    result = false;
                }
            }).catch(() => {
                alert('Ups... nur Administratoren dürfen diese Seite aufrufen.!');
                this.router.navigate(['']);
                result = false;
            });
        return result;
    }
}
