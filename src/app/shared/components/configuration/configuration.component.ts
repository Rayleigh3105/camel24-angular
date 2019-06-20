import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader-service.service';
import {DashboardService} from '../../services/dashboard.service';
import {AuthService} from '../../services/auth.service';
import {NgForm} from '@angular/forms';
import {SmtpConfig} from '../../../core/models/user/smtp-config';
import {Message} from 'primeng/api';
import {PriceConfig} from '../../../core/models/user/price-config';
import {Subscription} from 'rxjs';
import {User} from '../../../core/models/user/user-model';

@Component({
    selector: 'camel-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {

    constructor(public $httpLoader: LoaderService, public $dasboardService: DashboardService, private $authService: AuthService) {
    }

    public config: SmtpConfig;
    public priceConfig: PriceConfig;
    private subs: Subscription[] = [] = [];
    displayDialog: boolean;
    msgs: Message[] = [];
    msgsModal: Message[] = [];
    msgsUser: Message[] = [];

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


    ngOnInit() {
        this.$dasboardService.getSmtpConfig().then(configs => this.config = configs);
        this.subs.push(this.$dasboardService.getPriceConfig().subscribe());
        this.updateNgModelVariablesWithSessionStorage()
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    /**
     * Saves configuration to Backend.
     * @param form
     */
    protected onSave(form: NgForm) {
        if (form.valid) {
            form.value._id = this.config._id;
            this.subs.push(this.$dasboardService.updateSmtpConfiguration(form.value).subscribe(body => {
                if (body !== null) {
                    // Shows P-Message
                    this.showSuccess();
                }
            }, error => {
                this.showError(error);
            }));
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
    showSuccess() {
        this.msgs = [];
        this.msgs.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: `Einstellungen  wurde erfolgreich gespeichert.`
        });
    }

    /**
     * Shows p-message component after error has been thrown
     */
    showErrorModal(error) {
        this.msgsModal = [];
        this.msgsModal.push({
            severity: 'error',
            summary: error.error.errorCode,
            detail: error.error.message
        });
    }

    /**
     * Shows p-message component after succes of registration
     */
    showSuccessModal() {
        this.msgsModal = [];
        this.msgsModal.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: `Preis  wurde erfolgreich gespeichert.`
        });
    }

    /**
     * Shows p-message component after error has been thrown
     */
    showErrorUser(error) {
        this.msgsUser = [];
        this.msgsUser.push({
            severity: 'error',
            summary: error.error.errorCode,
            detail: error.error.message
        });
    }

    /**
     * Shows p-message component after succes of registration
     */
    showSuccessUser() {
        this.msgsUser = [];
        this.msgsUser.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: `Benutzer wurde erfolgreich gespeichert.`
        });
    }

    /**
     * Get´s fired when row is selected
     * - clones order
     * - opens up info modal with values from row
     * @param event
     */
    onRowSelect(event) {
        this.priceConfig = ConfigurationComponent.clonePriceConfig(event.data);
        this.displayDialog = true;
    }

    /**
     * Clones currently selected order
     * @param cloneOrder - order to clone
     */
    static clonePriceConfig(cloneOrder): any {
        let order = {};
        for (let prop in cloneOrder) {
            order[prop] = cloneOrder[prop];
        }
        return order;
    }

    /**
     * Updates given Config
     *
     * @param priceConfig - config to update
     */
    updateConfig(priceConfig: PriceConfig) {
        this.subs.push(this.$dasboardService.updatePriceConfig(priceConfig).subscribe(data => {
            if (data) {
                this.showSuccessModal();
            }
        }, error => {
            this.showErrorModal(error);
        }));
    }

    /**
     * Reloads Page
     */
    onCloseModal() {
        window.location.reload(true);
    }

    /**
     * Updates the user based on the inoputs
     * @param form - form from the frontend
     */
    protected async onUpdate(form: NgForm) {
        if (form.valid) {
            let userId: string = '';
            await this.$authService.getCurrentUser().then(response => {
                userId = response._id;
            }, error => {
                this.showError(error);
            });
            // Create User object with updated values in it from the form
            let user: User = {
                _id: userId,
                firstName: form.value.vorname,
                lastName: form.value.nachname,
                firmenName: form.value.firmenname,
                email: form.value.email,
                adresse: form.value.adresse,
                ort: form.value.ort,
                land: form.value.land,
                telefon: form.value.telefon,
                plz: form.value.plz,

            };

            this.subs.push(this.$dasboardService.updateUser(user).subscribe(body => {
                if (body !== null) {
                    // Updates SessionStorage with ngModel variables
                    this.updateNgModelVariablesWithSessionStorage();
                    // Shows P-Message
                    this.showSuccessUser();
                }
            }, error => {
                this.showErrorUser(error);
            }));
        }
    }

    /**
     * Updated ngModel Attributes in Template with data given in Sessionstorage
     */
    updateNgModelVariablesWithSessionStorage() {
        this.$authService.getCurrentUser().then(user => {
            this.sessionKundenNummer = user.kundenNummer.toString();
            this.sessionFirmenName = user.firmenName;
            this.sessionAdresse = user.adresse;
            this.sessionLand = user.land;
            this.sessionPlz = user.plz;
            this.sessionOrt = user.ort;
            this.sessionTelefon = user.telefon;
            this.sessionEmail = user.email;
            this.sessionNachname = user.lastName;
            this.sessionVorname = user.firstName;
        });
    }
}
