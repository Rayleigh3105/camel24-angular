import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../../../shared/services/auth.service';
import {User} from '../../../../core/models/user/user-model';
import {Router} from '@angular/router';
import {Message, MessageService} from 'primeng/api';

@Component({
  selector: 'camel-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
  providers: [MessageService]

})
export class LoginRegisterComponent implements OnInit {

    /**
     * VARIABLEN
     */
    protected errorMessageSignup:string;
    msgs: Message[] = [];


    constructor(private $authService: AuthService, private router: Router, private $messageService: MessageService) { }

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

          this.$authService.createUser( user ).subscribe(body => {
              if(body !== null) {
                  window.scroll(0,0);
                  sessionStorage.setItem('x-auth', body);
                  form.resetForm()
                  this.showSuccess();
              }
          });
      }
  }

    private showSuccess() {
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'Erfolgreich', detail:'Sie haben sich erfolgreich bei Camel-24 registiert.'});
    }

}
