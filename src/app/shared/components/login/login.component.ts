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

            this.$authService.loginUser(user).subscribe(body => {
                if (body !== null) {
                    window.scroll(0, 0);

                    // @ts-ignore
                    sessionStorage.setItem('x-auth', body.tokens[0].token);
                    // @ts-ignore
                    sessionStorage.setItem('kundenNummer', body.kundenNummer);
                    // @ts-ignore
                    sessionStorage.setItem('firmenName', body.firmenName);
                    // @ts-ignore
                    sessionStorage.setItem('email', body.email);
                    // @ts-ignore
                    sessionStorage.setItem('adresse', body.adresse);
                    // @ts-ignore
                    sessionStorage.setItem('land', body.land);
                    // @ts-ignore
                    sessionStorage.setItem('plz', body.plz);
                    // @ts-ignore
                    sessionStorage.setItem('ort', body.ort);
                    // @ts-ignore
                    sessionStorage.setItem('telefon', body.telefon);
                    // @ts-ignore
                    sessionStorage.setItem('vorname', body.firstName);
                    // @ts-ignore
                    sessionStorage.setItem('nachname', body.lastName);
                    form.resetForm();
                    this.showSuccess(body);
                }
            }, error => {
                this.showError();
                console.log(error);
            });
        }
    }

    /**
     * Shows p-message component after error has been thrown
     */
    showError() {
        this.msgs = [];
        this.msgs.push({
            severity: 'error',
            summary: 'Registrierung Fehlgeschlagen',
            detail: 'Bitte versuchen Sie es erneut sich zu registrieren.'
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

}
