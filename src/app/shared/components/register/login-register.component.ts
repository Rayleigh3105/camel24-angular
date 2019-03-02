import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../core/models/user/user-model';
import {Message} from 'primeng/api';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KepInputComponent} from '../../../modules/kep-input/pages/kep-input/kep-input.component';
import {LoaderService} from '../../services/loader-service.service';

@Component({
    selector: 'camel-login-register',
    templateUrl: './login-register.component.html',
    styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent extends KepInputComponent implements OnInit {

    /**
     * VARIABLEN
     */
    msgs: Message[] = [];

    constructor(private $authService: AuthService,
                public activeModal: NgbActiveModal,
                private $modalService: NgbModal,
                public $httpLoader: LoaderService,
                cdr: ChangeDetectorRef) {
        super($modalService, cdr, $authService);
    }

    ngOnInit() {}

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
                email: form.value.email,
                adresse: form.value.adresse,
                ort: form.value.ort,
                land: form.value.land,
                telefon: form.value.telefon,
                plz: form.value.plz,
                password: form.value.passwort
            };

            this.$authService.createUser(user).subscribe(response => {
                if (response !== null) {
                    window.scroll(0, 0);

                  this.setSessionStorage(response.body);
                    // Reset Form
                    form.resetForm();
                    this.updateNgModelVariablesWithSessionStorage();
                    this.showSuccess(response.body);
                }
            }, error => {
                this.showError(error);
                console.log(error);
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
    showSuccess(response) {
        this.msgs = [];
        this.msgs.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: `Herzlich Wilkommen ${response.user.firmenName} - ${response.user.kundenNummer} bei dem Camel-24 Auftrags Online Service`
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
