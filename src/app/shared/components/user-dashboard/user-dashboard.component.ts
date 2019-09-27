import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader-service.service';
import {SessionStorageComponent} from '../session-storage/session-storage.component';
import {NgForm} from '@angular/forms';
import {DashboardService} from '../../services/dashboard.service';
import {User} from '../../../core/models/user/user-model';
import {Message} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {saveAs as importedSaveAs} from 'file-saver';
import {Subscription} from 'rxjs';
import {CsvExportService} from '../../services/csv-export.service';
import {Template} from '../../../core/models/user/template-model';


@Component({
    selector: 'camel-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent extends SessionStorageComponent implements OnInit, OnDestroy {

    /**
     * VARIABLES
     */
    msgs: Message[] = [];
    subs: Subscription[] = [];

    displayDialog: boolean = false;

    order: any;
    public template: Template;
    header: string;

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
    public sessionZusatz: string;
    public sessionAnsprechpartner: string;

    constructor(public $httpLoader: LoaderService,
                public $dasboardService: DashboardService,
                private $authService: AuthService,
                private ndbModal: NgbModal,
                public $orderService: CsvExportService) {
        super();
    }

    async ngOnInit() {
        await this.updateNgModelVariablesWithSessionStorage();
        await this.subs.push(this.$orderService.getTemplates(this.sessionKundenNummer).subscribe());
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }


    /**
     * Updates the user based on the inoputs
     * @param form - form from the frontend
     */
    async onUpdate(form: NgForm) {
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
                firma: form.value.firmenname,
                email: form.value.email,
                adresse: form.value.adresse,
                ort: form.value.ort,
                land: form.value.land,
                telefon: form.value.telefon,
                plz: form.value.plz,
                zusatz: form.value.zusatz,
                ansprechpartner: form.value.ansprechpartner

            };

            this.subs.push(this.$dasboardService.updateUser(user).subscribe(body => {
                if (body !== null) {
                    // Updates SessionStorage with ngModel variables
                    this.updateNgModelVariablesWithSessionStorage();
                    // Shows P-Message
                    this.showSuccess(body);
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
    async updateNgModelVariablesWithSessionStorage() {
        await this.$authService.getCurrentUser().then(user => {
            this.sessionKundenNummer = user.kundenNummer.toString();
            // @ts-ignore
            this.sessionFirmenName = user.firmenName;
            this.sessionZusatz = user.zusatz;
            this.sessionAnsprechpartner = user.ansprechpartner;
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

    updateTemplate() {
        this.subs.push(this.$orderService.updateTemplate(this.template._id, this.template).subscribe());
        this.displayDialog = false;

    }


    deleteTemplate() {
        this.subs.push(this.$orderService.deleteTemplate(this.template._id).subscribe());
        this.displayDialog = false;
    }

    /**
     * Get´s fired when row is selected
     * - clones order
     * - opens up info modal with values from row
     * @param event
     */
    onRowSelect(event) {
        this.template = UserDashboardComponent.cloneTemplate(event.data);
        this.displayDialog = true;
    }

    /**
     * Clones currently selected order
     * @param cloneOrder - order to clone
     */
    static cloneTemplate(cloneOrder): any {
        let order = {};
        for (let prop in cloneOrder) {
            order[prop] = cloneOrder[prop];
        }
        return order;
    }

}
