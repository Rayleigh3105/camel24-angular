import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../core/models/user/user-model';
import {Message} from 'primeng/api';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'camel-login-register',
    templateUrl: './login-register.component.html',
    styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent implements OnInit {

    /**
     * VARIABLEN
     */
    protected errorMessageSignup: string;
    msgs: Message[] = [];


    constructor(private $authService: AuthService, public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
    }

    /**
     * Register User in Database
     * @param form - register form
     */
    protected onRegister(form: NgForm) {
        if (form.valid) {
            let user: User = {
                firstName: form.value.vorname,
                lastName: form.value.nachname,
                firmenName: form.value.firmenname,
                kundenNummer: parseInt(form.value.kundennummer),
                email: form.value.email,
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

                        form.resetForm();
                        this.showSuccess(body);
                    }
                }, error => {
                    this.showError()
                    console.log(error)
                });


        }
    }


    /**
     * Shows p-message component after error has been thrown
     */
    private showError() {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Registrierung Fehlgeschlagen', detail: 'Bitte versuchen Sie es erneut sich zu registrieren.'});
    }

    /**
     * Shows p-message component after succes of registration
     */
    private showSuccess(value) {
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: 'Erfolgreich', detail: `Herzlich Wilkommen ${value.firmenName} - ${value.kundenNummer} bei dem Camel-24 Auftrags Online Service`});
    }

}