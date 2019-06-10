import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader-service.service';
import {DashboardService} from '../../services/dashboard.service';
import {AuthService} from '../../services/auth.service';
import {NgForm} from '@angular/forms';
import {SmtpConfig} from '../../../core/models/user/smtp-config';
import {Message} from 'primeng/api';

@Component({
    selector: 'camel-configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

    constructor(public $httpLoader: LoaderService, public $dasboardService: DashboardService, private $authService: AuthService,) {
    }

    public config: SmtpConfig;
    msgs: Message[] = [];


    ngOnInit() {
        this.$dasboardService.getSmtpConfig().then(configs => this.config = configs);
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
            });;
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
            detail: `SMTP Einstellungen  wurde erfolgreich gespeichert.`
        });
    }

}
