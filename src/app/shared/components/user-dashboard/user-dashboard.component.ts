import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader-service.service';
import {SessionStorageComponent} from '../session-storage/session-storage.component';
import {NgForm} from '@angular/forms';
import {DashboardService} from '../../services/dashboard.service';
import {User} from '../../../core/models/user/user-model';
import {Message} from 'primeng/api';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'camel-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent extends SessionStorageComponent implements OnInit {

    /**
     * VARIABLES
     */
    msgs: Message[] = [];

    // NGMODEL
    public sessionVorname: string;
    public sessionNachname: string;
    public sessionFirmenName: string;
    public sessionKundenNummer: string;
    public sessionAdresse: string;
    public sessionLand: string;
    public sessionPlz: string;
    public sessionOrt: string;
    public sessionTelefon: string;
    public sessionEmail: string;

    constructor(public $httpLoader: LoaderService, private $dasboardService: DashboardService, private $authService: AuthService) {
        super();
    }

    ngOnInit() {
        this.updateNgModelVariablesWithSessionStorage()
    }

    /**
     * Updates the user based on the inoputs
     * @param form - form from the frontend
     */
    async onUpdate(form : NgForm) {
        if(form.valid) {
            let userId : string = '';
            await this.$authService.getCurrentUser().then(response => {
                userId = response._id;
                console.log(userId);
            } );
            // Create User object with updated values in it from the form
            let user: User = {
                _id : userId,
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
            };

            this.$dasboardService.updateUser( user ).subscribe( body => {
                if (body !== null) {

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
                    // @ts-ignore
                    sessionStorage.setItem('vorname', body.firstName);
                    // @ts-ignore
                    sessionStorage.setItem('nachname', body.lastName);

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
            summary: 'Bearbeiten fehlgeschlagen',
            detail: 'Bitte versuchen Sie erneut den Benutzer zu bearbeiten.'
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
            detail: `Benutzer wurde erfolgreich gespeichert.`
        });
    }

    /**
     * Updated ngModel Attributes in Template with data given in Sessionstorage
     */
    updateNgModelVariablesWithSessionStorage() {
        this.sessionKundenNummer = this.getKundennummer();
        this.sessionFirmenName = this.getFirmenname();
        this.sessionAdresse = this.getAdresse();
        this.sessionLand = this.getLand();
        this.sessionPlz = this.getPlz();
        this.sessionOrt = this.getOrt();
        this.sessionTelefon = this.getTelefon();
        this.sessionEmail = this.getEmail();
        this.sessionNachname = this.getNachname();
        this.sessionVorname = this.getVorname();
    }

}