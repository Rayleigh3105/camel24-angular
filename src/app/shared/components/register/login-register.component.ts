import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../core/models/user/user-model';
import {Message} from 'primeng/api';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KepInputComponent} from '../../../modules/kep-input/pages/kep-input/kep-input.component';

@Component({
    selector: 'camel-login-register',
    templateUrl: './login-register.component.html',
    styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent extends KepInputComponent implements OnInit {

    /**
     * VARIABLEN
     */
    errorMessageSignup: string;
    msgs: Message[] = [];
    landSelected: string = 'Deutschland';

    constructor(private $authService: AuthService, public activeModal: NgbActiveModal, private $modalService: NgbModal) {
        super($modalService);
    }

    ngOnInit() {
    }

    /**
     * Register User in Database
     * @param form - register form
     */
    onRegister(form: NgForm) {
        if (form.valid) {
            let user: User = {
                firstName: form.value.vorname,
                lastName: form.value.nachname,
                firmenName: form.value.firmenname,
                kundenNummer: parseInt(form.value.kundennummer),
                email: form.value.email,
                adresse: form.value.adresse,
                ort: form.value.ort,
                land: form.value.land,
                telefon: form.value.telefon,
                plz: form.value.plz,
                password: form.value.passwort
            };

            this.$authService.createUser(user).subscribe(body => {
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
                    sessionStorage.setItem('ort', body.ort);
                    // @ts-ignore
                    sessionStorage.setItem('land', body.land);
                    // @ts-ignore
                    sessionStorage.setItem('telefon', body.telefon);
                    // @ts-ignore
                    sessionStorage.setItem('plz', body.plz);

                    form.resetForm();
                    this.updateNgModelVariablesWithSessionStorage();
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
