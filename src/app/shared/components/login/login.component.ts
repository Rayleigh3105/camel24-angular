import {Component, OnInit} from '@angular/core';
import {Message} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
import {NgForm} from '@angular/forms';
import {User} from '../../../core/models/user/user-model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {LoaderService} from '../../services/loader-service.service';

@Component({
    selector: 'camel-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    /**
     * VARIABLEN
     */
    errorMessageSignup: string;
    msgs: Message[] = [];

    constructor(private $authService: AuthService, public activeModal: NgbActiveModal, public $httpLoader: LoaderService) {}

    ngOnInit() {
    }

    /**
     * Register User in Database
     * @param form - register form
     */
    onLogin(form: NgForm) {
        if (form.valid) {
            let user: User = {
                kundenNummer: parseInt(form.value.kundennummer),
                password: form.value.passwort
            };

            this.$authService.loginUser(user).subscribe(response => {
                if (response !== null) {
                    window.scroll(0, 0);
                    this.setSessionStorage(response.body);

                    form.resetForm();
                    // @ts-ignore
                    this.activeModal.close(`Herzlich Wilkommen ${response.body.user.kundenNummer} bei dem Camel-24 Auftrags Online Service`);
                }
            }, error => {
                this.showError(error);
            });
        }
    }

    /**
     * Shows p-message component after error has been thrown
     */
    showError(error) {
        this.msgs = [];
        this.msgs.push({
            severity: 'error',
            summary: error.error.errorCode,
            detail: error.error.message
        });
    }

    /**
     * Dertermines what happens after Modal has been closed
     */
    onClose() {
        this.activeModal.close();
    }

    /**
     * Set`s SessionStorage for available data
     * @param body
     */
    setSessionStorage(body) {

      if (body.token) {
        // @ts-ignore
        sessionStorage.setItem('x-auth', body.token);
      } else {
        sessionStorage.removeItem('x-auth');
      }


      if (body.user.kundenNummer) {
        // @ts-ignore
        sessionStorage.setItem('kundenNummer', body.user.kundenNummer);
      } else {
        sessionStorage.removeItem('kundenNummer');
      }

      if (body.user.firmenName) {
        // @ts-ignore
        sessionStorage.setItem('firmenName', body.user.firmenName);
      } else {
        sessionStorage.removeItem('firmenName');
      }

      if (body.user.email) {
        // @ts-ignore
        sessionStorage.setItem('email', body.user.email);
      } else {
        sessionStorage.removeItem('email');
      }

      if (body.user.adresse) {
        // @ts-ignore
        sessionStorage.setItem('adresse', body.user.adresse);
      } else {
        sessionStorage.removeItem('adresse');
      }

      if (body.user.ort) {
        // @ts-ignore
        sessionStorage.setItem('ort', body.user.ort);
      } else {
        sessionStorage.removeItem('ort');
      }

      if (body.user.land) {
        // @ts-ignore
        sessionStorage.setItem('land', body.user.land);
      } else {
        sessionStorage.removeItem('land');
      }

      if (body.user.telefon) {
        // @ts-ignore
        sessionStorage.setItem('telefon', body.user.telefon);
      } else {
        sessionStorage.removeItem('telefon');
      }

      if (body.user.plz) {
        // @ts-ignore
        sessionStorage.setItem('plz', body.user.plz);
      } else {
        sessionStorage.removeItem('plz');
      }

      if (body.user.firstName) {
        // @ts-ignore
        sessionStorage.setItem('vorname', body.user.firstName);
      } else {
        sessionStorage.removeItem('vorname');
      }

      if (body.user.lastName) {
        // @ts-ignore
        sessionStorage.setItem('nachname', body.user.lastName);
      } else {
        sessionStorage.removeItem('nachname');
      }

      if (body.user.zusatz) {
        // @ts-ignore
        sessionStorage.setItem('zusatz', body.user.zusatz);
      } else {
        sessionStorage.removeItem('zusatz');
      }

      if (body.user.ansprechpartner) {
        // @ts-ignore
        sessionStorage.setItem('ansprechpartner', body.user.ansprechpartner);
      } else {
        sessionStorage.removeItem('ansprechpartner');
      }
    }

}
