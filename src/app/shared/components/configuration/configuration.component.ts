import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader-service.service';
import {DashboardService} from '../../services/dashboard.service';
import {AuthService} from '../../services/auth.service';
import {NgForm} from '@angular/forms';
import {SmtpConfig} from '../../../core/models/user/smtp-config';
import {Message} from 'primeng/api';
import {PriceConfig} from '../../../core/models/user/price-config';

@Component({
    selector: 'camel-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

    constructor(public $httpLoader: LoaderService, public $dasboardService: DashboardService, private $authService: AuthService, private cdr: ChangeDetectorRef) {
    }

    public config: SmtpConfig;
    public priceConfig: PriceConfig;
    displayDialog: boolean;
    msgs: Message[] = [];
    msgsModal: Message[] = [];

    ngOnInit() {
        this.$dasboardService.getSmtpConfig().then(configs => this.config = configs);
        this.$dasboardService.getPriceConfig().subscribe();
    }

    /**
     * Saves configuration to Backend.
     * @param form
     */
    protected onSave(form: NgForm) {
        if (form.valid) {
            form.value._id = this.config._id;
            this.$dasboardService.updateSmtpConfiguration(form.value).subscribe(body => {
                if (body !== null) {
                    // Shows P-Message
                    this.showSuccess(null);
                }
            }, error => {
                this.showError(error);
            });
            ;
        }
    }

    /**
     * Shows p-message component after error has been thrown
     */
    showError(error) {
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
    showSuccess(value) {
        this.msgsModal = [];
        this.msgsModal.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: `Einstellungen  wurde erfolgreich gespeichert.`
        });
    }

    /**
     * Shows p-message component after error has been thrown
     */
    showErrorModal(error) {
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
    showSuccessModal(value) {
        this.msgs = [];
        this.msgs.push({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: `Preis  wurde erfolgreich gespeichert.`
        });
    }

    /**
     * Get´s fired when row is selected
     * - clones order
     * - opens up info modal with values from row
     * @param event
     */
    onRowSelect(event) {
        this.priceConfig = this.clonePriceConfig(event.data);
        this.displayDialog = true;
    }

    /**
     * Clones currently selected order
     * @param cloneOrder - order to clone
     */
    clonePriceConfig(cloneOrder): any {
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
        this.$dasboardService.updatePriceConfig(priceConfig).subscribe(() => {
            this.showSuccess(null);
        });
    }

    onClose() {
        console.log("hello")
    }


}
