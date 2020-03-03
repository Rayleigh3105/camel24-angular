import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader-service.service';
import {DashboardService} from '../../services/dashboard.service';
import {AuthService} from '../../services/auth.service';
import {NgForm} from '@angular/forms';
import {SmtpConfig} from '../../../core/models/config/smtp-config';
import {Message} from 'primeng/api';
import {PriceConfig} from '../../../core/models/config/price-config';
import {Subscription} from 'rxjs';
import {User} from '../../../core/models/user/user-model';

@Component({
    selector: 'camel-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {

    constructor(public $httpLoader: LoaderService, public $dasboardService: DashboardService, private $authService: AuthService, private cdr: ChangeDetectorRef) {
    }

    //////////////////////////////////////////////////
    // ATTRIBUTE
    /////////////////////////////////////////////////


    public config: SmtpConfig;
    public priceConfig: PriceConfig;
    private subs: Subscription[] = [] = [];
    displayDialog: boolean = false;
    displayDialogCreate: boolean = false;
    msgs: Message[] = [];
    msgsModal: Message[] = [];
    msgsUser: Message[] = [];
    public disableInput: boolean = false;
    priceType: any[];

    public user: User;

    public sessionPriceType;

    //////////////////////////////////////////////////
    // LIFECYCLEHOOKS
    /////////////////////////////////////////////////


    ngOnInit() {
        this.$dasboardService.getSmtpConfig().then(configs => this.config = configs);
        this.subs.push(this.$dasboardService.getPriceConfig().subscribe());
        this.getUser();
        this.fillPriceType();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    //////////////////////////////////////////////////
    // SAVE
    /////////////////////////////////////////////////


    /**
     * Saves configuration to Backend.
     * @param form
     */
    public onSave(form: NgForm) {
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
     * Save Price to database
     * @param form
     */
    onPriceSave(form: NgForm) {
        if (form.valid) {
            let price: PriceConfig = {
                type: form.value.type,
                price: form.value.price,
                time: form.value.time
            };

            this.subs.push(this.$dasboardService.createPriceConfig(price).subscribe(data => {
                if (data) {
                    this.showSuccessModal();
                    this.disableInput = true;
                    this.displayDialogCreate = false;
                }
            }, error => {
                this.showErrorModal(error);
            }));
        }
    }

    /**
     * Updates the user based on the inoputs
     * @param form - form from the frontend
     */
    public async onUpdate(form: NgForm) {
        if (form.valid) {
            this.subs.push(this.$dasboardService.updateUser(this.user).subscribe(body => {
                if (body !== null) {
                    // Updates SessionStorage with ngModel variables
                    this.getUser();
                    // Shows P-Message
                    this.showSuccessUser();

                }
            }, error => {
                this.showErrorUser(error);
            }));
        }
    }

    /**
     * Updates given priceConfig
     *
     * @param priceConfig - config to update
     */
    updateConfig(priceConfig: PriceConfig) {
        this.subs.push(this.$dasboardService.updatePriceConfig(priceConfig).subscribe(data => {
            if (data) {
                this.showSuccessModal();
                this.disableInput = true;
                this.displayDialog = false;

            }
        }, error => {
            this.showErrorModal(error);
        }));
    }

    //////////////////////////////////////////////////
    // DELETE
    /////////////////////////////////////////////////


    /**
     * Deletes Price config on backend
     */
    deletePriceConfig() {
        this.subs.push(this.$dasboardService.deletePriceConfig(this.priceConfig._id).subscribe(data => {
            if (data) {
                this.showSuccessModalDelete();
                this.disableInput = true;
                this.displayDialog = false;
                this.priceConfig = null
            }
        }, error => {
            this.showErrorModalDelete(error);
        }));
    }

    //////////////////////////////////////////////////
    // MODAL
    /////////////////////////////////////////////////

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
    showErrorModalDelete(error) {
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
    showSuccessModalDelete() {
        this.msgsModal = [];
        this.msgsModal.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: `Preis wurde erfolgreich gelöscht.`
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
     * Opens Modal
     */
    openCreateModal() {
        this.displayDialogCreate = true;
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
    static clonePriceConfig(cloneOrder: any): any {
        let order = {};
        for (let prop in cloneOrder) {
            order[prop] = cloneOrder[prop];
        }
        return order;
    }

    /**
     * Updated ngModel Attributes in Template with data given in Sessionstorage
     */
    getUser() {
        this.$authService.getCurrentUser().then(user => this.user = user);
    }

    /**
     * Fills information for priceType.
     */
    fillPriceType(): void {
        this.priceType = [
            {
                name: 'Abholpreis',
                value: 'abhol'
            },
            {
                name: 'Zustellpreis',
                value: 'zustell'
            },
            {
                name: 'Identpreis',
                value: 'ident'
            },
            {
                name: 'Versicherungspreis',
                value: 'versicherung'
            },
            {
                name: 'Nachnahmepreis',
                value: 'nachnahme'
            },
        ];
    }

    //////////////////////////////////////////////////
    // DISPLAY
    /////////////////////////////////////////////////

    /**
     * Checks if Transaltion should contain UHR or not.
     *
     * @param priceConfig
     */
    displayUhrQuery(priceConfig: PriceConfig): boolean {
        if (priceConfig != null) {
            return priceConfig.time !== 'samstag' && priceConfig.time !== null && priceConfig.time !== '';
        }
    }

    /**
     * Checks if UHR should not display UHR.
     *
     * @param priceConfig
     */
    dontDisplayUhrQuery(priceConfig: PriceConfig): boolean {
        if (priceConfig != null) {
            return priceConfig.time == 'samstag' || priceConfig.time == null || priceConfig.time == '';
        }
    }


    /**
     * Translates value based on key.
     *
     * @param key
     */
    translatePrice(key: string): string {
        if (key != null) {
            return this.priceType.find(value => value.value == key).name;

        }
    }
}
