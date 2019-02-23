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
                    sessionStorage.setItem('x-auth', response.headers.get('x-auth'));
                    this.setSessionStorage(response.body);

                    form.resetForm();

                    this.showSuccess(response.body);
                }
            }, error => {
                this.showError(error);
                console.debug(error);
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
     * Shows p-message component after succes of registration
     */
    showSuccess(value) {
        this.msgs = [];
        this.msgs.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: `Herzlich Wilkommen ${value.firmenName} - ${value.kundenNummer} bei dem Camel-24 Auftrags Online Service`
        });
    }

    /**
     * Dertermines what happens after Modal has been closed
     */
    onClose() {
        this.activeModal.close(true);
    }

    /**
     * Set`s SessionStorage for available data
     * @param body
     */
    setSessionStorage(body) {

        if (body.kundenNummer) {
            // @ts-ignore
            sessionStorage.setItem('kundenNummer', body.kundenNummer);
        } else {
            sessionStorage.removeItem('kundenNummer');
        }

        if (body.firmenName) {
            // @ts-ignore
            sessionStorage.setItem('firmenName', body.firmenName);
        } else {
            sessionStorage.removeItem('firmenName');
        }

        if (body.email) {
            // @ts-ignore
            sessionStorage.setItem('email', body.email);
        } else {
            sessionStorage.removeItem('email');
        }

        if (body.adresse) {
            // @ts-ignore
            sessionStorage.setItem('adresse', body.adresse);
        } else {
            sessionStorage.removeItem('adresse');
        }

        if (body.ort) {
            // @ts-ignore
            sessionStorage.setItem('ort', body.ort);
        } else {
            sessionStorage.removeItem('ort');
        }

        if (body.land) {
            // @ts-ignore
            sessionStorage.setItem('land', body.land);
        } else {
            sessionStorage.removeItem('land');
        }

        if (body.telefon) {
            // @ts-ignore
            sessionStorage.setItem('telefon', body.telefon);
        } else {
            sessionStorage.removeItem('telefon');
        }

        if (body.plz) {
            // @ts-ignore
            sessionStorage.setItem('plz', body.plz);
        } else {
            sessionStorage.removeItem('plz');
        }

        if (body.firstName) {
            // @ts-ignore
            sessionStorage.setItem('vorname', body.firstName);
        } else {
            sessionStorage.removeItem('vorname');
        }

        if (body.lastName) {
            // @ts-ignore
            sessionStorage.setItem('nachname', body.lastName);
        } else {
            sessionStorage.removeItem('nachname');
        }

        if (body.zusatz) {
            // @ts-ignore
            sessionStorage.setItem('zusatz', body.zusatz);
        } else {
            sessionStorage.removeItem('zusatz');
        }

        if (body.ansprechpartner) {
            // @ts-ignore
            sessionStorage.setItem('ansprechpartner', body.ansprechpartner);
        } else {
            sessionStorage.removeItem('ansprechpartner');
        }
    }

}
