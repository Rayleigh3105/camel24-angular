import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {User} from '../../../../core/models/user/user-model';
import {Router} from '@angular/router';

@Component({
  selector: 'camel-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent implements OnInit {

    /**
     * VARIABLEN
     */
    protected errorMessageSignup:string;

    constructor(private $authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

    /**
     * Register User in Database
     * @param form - register form
     */
  protected onRegister(form: NgForm) {
      if(form.valid) {
          let user: User = {
              firstName: form.value.vorname,
              lastName: form.value.nachname,
              firmenName: form.value.firmenname,
              kundenNummer: parseInt(form.value.kundennummer),
              email: form.value.email,
              password: form.value.passwort
          };

          this.$authService.createUser( user )
              .then(() => {
                  this.router.navigate(['']);
              }).catch( reason => {
              this.errorMessageSignup = "Registrierungsfehler" + reason.error;
          })

      }
  }

}
