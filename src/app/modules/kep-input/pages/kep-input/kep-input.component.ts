import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BestModalComponent} from '../../../../shared/components/best-modal/best-modal.component';
import {NgForm} from '@angular/forms';
import {SessionStorageComponent} from '../../../../shared/components/session-storage/session-storage.component';
import {AuthService} from '../../../../shared/services/auth.service';
import {DashboardService} from '../../../../shared/services/dashboard.service';
import {Subscription} from 'rxjs';
import {PriceConfig} from '../../../../core/models/config/price-config';
import {any} from 'codelyzer/util/function';
import {User} from '../../../../core/models/user/user-model';
import {Template} from '../../../../core/models/user/template-model';
import {CsvExportService} from '../../../../shared/services/csv-export.service';
import {LoaderService} from '../../../../shared/services/loader-service.service';
import {SelectItem} from 'primeng/api';

@Component({
    selector: 'camel-kep-input',
    templateUrl: './kep-input.component.html',
    styleUrls: ['./kep-input.component.scss']
})
export class KepInputComponent extends SessionStorageComponent implements OnInit, OnDestroy {

    @ViewChild('myCalendar', {read: any}) myCalendar: any;

    /**
     * VARIABLES
     */
    public minDate: Date = new Date();
    public minDateZustell: Date = new Date();
    public maxDate: Date = new Date();
    public abholDatum1: Date = new Date();
    public zustellDatum1: Date = new Date();
    subs: Subscription[] = [];
    public shouldManuellDisplayed: boolean = false;
    public deAbholZeit: any;
    public showDialog: boolean = false;
    public requestSuccessfully: boolean = false;
    public requestError: boolean = false;
    public abholErrorMessage: string;
    public zustellErrorMessage: string;
    public zustellNachnahmeErrorMessage: string;
    public priceList: PriceConfig[];
    public disableTemplateDialog: boolean = false;
    template: Template = new Template();
    kundenNummer: string;
    selectedTemplate: Template = new Template();
    templates: SelectItem[] = [];


    // NGMODEL
    public sessionFirmenName: string;
    public sessionKundenNummer: string;
    public sessionZusatz: string;
    public sessionAnsprechpartner: string;
    public sessionAdresse: string;
    public sessionLand: string;
    public sessionPlz: string;
    public sessionOrt: string;
    public sessionTelefon: string;
    public sessionRechnungTelefon: string;
    public sessionRechnungEmail: string;
    public sessionEmail: string;
    public empfLandSelected: string = 'Deutschland';
    public absLandSelected: string = 'Deutschland';
    public rechnungSelected: string = 'absender';
    public artSelected: string = 'Waffe';
    public kiloSelected: string = '3';
    public versicherungSelected: string = 'Nein';
    public sonderdienstSelected: string = 'persoenlichIdent';
    public abholZeitFensterModel: string = '09-17';
    public zustellZeitFensterModel: string = '09-17';
    public isZustellNachnahme: boolean = false;
    public zustellNachnahmeWertModel: string;
    public checkIfLoggedIn: boolean = false;

    constructor(private modalService: NgbModal,
                private cdr: ChangeDetectorRef,
                protected $authService: AuthService,
                private $dashboardService: DashboardService,
                public $orderService: CsvExportService,
                public $httpLoader: LoaderService
    ) {

        super();
        this.updateNgModelVariablesWithSessionStorage();

    }

    ngOnInit() {
        window.scroll(0, 0);

        // Set´s up PrimeNg Date Picker
        this.setupAbholZeitDatePicker();
        this.setupPriceList();

        let interval = setInterval(() => {
            if (SessionStorageComponent.getXAuth() !== null) {
                this.checkIfLoggedIn = true;
                this.updateNgModelVariablesWithSessionStorage();
                if (this.sessionFirmenName !== null) {
                    clearInterval(interval);
                }
            }

        }, 1000);

        this.updateNgModelVariablesWithSessionStorage();
        this.$authService.getCurrentUser().then(user => {
            this.kundenNummer = user.kundenNummer.toString();
        });
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    /**
     * Set´s up Datepicker logic for PrimeNG component
     */
    setupAbholZeitDatePicker() {
        this.deAbholZeit = {
            firstDayOfWeek: 0,
            dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            dayNamesShort: ['Son', 'Mon', 'Die', 'Mit', 'Do', 'Fri', 'Sam'],
            dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            today: 'Heute',
            clear: 'Löschen',
            dateFormat: 'dd.mm.yy'
        };

        let today = new Date();

        // Resolve mindate and maxdate
        if (today.getDay() === 3 || today.getDay() === 2 || today.getDay() === 1) {
            // Montag, Dienstag, Mittwoch
            this.minDate.setDate(today.getDate() + 1);
            this.maxDate.setDate(this.minDate.getDate() + 14);

        } else if (today.getDay() === 4) {
            // Donnerstag
            this.minDate.setDate(today.getDate() + 1);
            this.maxDate.setDate(today.getDate() + 14);

        } else if (today.getDay() === 5) {
            // Freitag
            this.minDate.setDate(today.getDate() + 3);
            this.maxDate.setDate(today.getDate() + 16);

        } else if (today.getDay() === 6) {
            // Samstag
            this.minDate.setDate(today.getDate() + 2);
            this.maxDate.setDate(today.getDate() + 13);
        } else if (today.getDay() === 0) {
            // Sonntag
            this.minDate.setDate(today.getDate() + 1);
            this.maxDate.setDate(today.getDate() + 12);
        }

        // Resolve Zustell Datum
        if (this.minDate.getDay() === 5) {
            this.zustellDatum1.setDate(this.minDate.getDate() + 3);
        } else {
            this.zustellDatum1.setDate(this.minDate.getDate() + 1);
        }

        // Resolve minDateZustell and abholdatum
        this.minDateZustell.setDate(this.zustellDatum1.getDate());
        this.abholDatum1.setDate(this.minDate.getDate());


    }

    /**
     * Checks if given string matches 'manuell' if yes a new input group is displayed
     * @param auftragsBestValue
     */
    onOptionAuftragsBestChange(auftragsBestValue: string) {
        this.shouldManuellDisplayed = auftragsBestValue === 'manuell';
    }

    /**
     * When Form is valid and KundenNummer is given opens the Confirmation Modal
     * @param form - form which is submitted
     */
    onSubmit(form: NgForm) {
        if (form.form.valid && !this.checkZustellArtWithArtSendung(form) && this.checkNachnahmeWert(form)) {
            const modalref = this.modalService.open(BestModalComponent, {
                size: 'lg',
                backdrop: 'static',
                centered: true,
                keyboard: false
            });

            // Set SessionStorage Variable for Modal use
            if (form.value.kundenNummer) {
                sessionStorage.removeItem('kundenNummer');
                sessionStorage.setItem('kundenNummer', form.value.kundenNummer);
            }

            form = this.prepareData(form);

            modalref.componentInstance.data = form.value;
            modalref.result.then(result => {
                if (result) {
                    form.resetForm();
                    this.requestSuccessfully = true;
                    this.updateNgModelVariablesWithSessionStorage();
                    this.cdr.detectChanges();

                } else {
                    this.requestError = true;
                }
            });
        }
    }

    /**
     * Maps data and open primeng dialog
     *
     * @param form
     */
    openTemplateDialog(form: NgForm) {
        this.template.empfaenger = KepInputComponent.prepareTemplateData(form);
        this.disableTemplateDialog = true;
    }

    /**
     * Saves the template in the database
     */
    createTemplate() {
        this.subs.push(this.$orderService.createTemplate(this.template, this.kundenNummer).subscribe(() => {
            this.disableTemplateDialog = false;

            this.$orderService.getTemplates(this.sessionKundenNummer).subscribe();
            this.$orderService.templates$.value.forEach(templateBehavior => {
                this.templates.push({
                    label: templateBehavior.name,
                    value: templateBehavior
                })
            });
        }));
    }

    /**
     * Updated ngModel Attributes in Template with data given in Sessionstorage
     * Also updates Selected Values in form with default values
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
            this.sessionRechnungTelefon = user.telefon;
            this.sessionRechnungEmail = user.email;
        });
        this.templates = [];
        this.selectedTemplate = new Template();

        await this.$orderService.getTemplates(this.sessionKundenNummer).subscribe();
        this.$orderService.templates$.value.forEach(templateBehavior => {
            this.templates.push({
                label: templateBehavior.name,
                value: templateBehavior
            })
        });

    }

    /**
     * Opens info Modal - user is now able to view how the App is working
     */
    openInfoModal() {
        this.showDialog = true;
    }

    0;

    /**
     * Checks if Empfänger Ansprechpartner is required.
     * Is required when:
     * - persoenlich
     * - persoenlich with ident
     *
     * @param form
     */
    public checkEmpfAnsprechPartner(form: NgForm): boolean {
        return form.value.zustellArt != 'standard';
    }

    /**
     * Checks if persoenliche abholung is required
     * Is required when:
     * - Waffe
     * - Munition
     * @param form
     */
    public checkZustellArtWithArtSendung(form: NgForm): boolean {
        return form.value.sendungsdatenArt !== 'Sonstiges' && !this.checkEmpfAnsprechPartner(form);
    }

    /**
     * Resolves Zustell Datum after abholdatum has been changed
     */
    public onAbholDateChanged() {
        // Resolve Zustell Datum
        this.zustellDatum1.setDate(this.abholDatum1.getDate() + 1);

        this.minDateZustell = this.zustellDatum1;
        this.myCalendar.inputFieldValue = ('0' + this.zustellDatum1.getDate()).slice(-2) + '.' + ('0' + (this.zustellDatum1.getMonth() + 1)).slice(-2) + '.' +
            this.zustellDatum1.getFullYear();
        this.myCalendar.updateUI();
    }

    /**
     * Prepares form data
     *
     * @param form - current form
     */
    private prepareData(form: NgForm): NgForm {
        if (form.value.auftragsbestRechnungsadresse === 'absender') {
            form.value.rechnungName = form.value.absFirma;
            form.value.rechnungAdresse = form.value.absAdresse;
            form.value.rechnungPlz = form.value.absPlz;
            form.value.rechnungOrt = form.value.absOrt;
        } else if (form.value.auftragsbestRechnungsadresse === 'empfeanger') {
            form.value.rechnungName = form.value.empfFirma;
            form.value.rechnungAdresse = form.value.empfAdresse;
            form.value.rechnungPlz = form.value.empfPlz;
            form.value.rechnungOrt = form.value.empfOrt;
        }

        // Delete Check and auftragsbestRechnungsadresse because it is not needed
        delete form.value.check;
        delete form.value.auftragsbestRechnungsadresse;

        // AbholZeit
        let abholZeitVon = form.value.abholZeitFenster.substring(0, 2);
        let abholZeitBis = form.value.abholZeitFenster.substring(3, 5);
        form.value.abholZeitVon = abholZeitVon + ':00';
        form.value.abholZeitBis = abholZeitBis + ':00';

        // ZustellZeit
        let zustellZeitVon = form.value.zustellZeitFenster.substring(0, 2);
        let zustellZeitBis = form.value.zustellZeitFenster.substring(3, 5);
        form.value.zustellZeitVon = zustellZeitVon + ':00';
        form.value.zustellZeitBis = zustellZeitBis + ':00';

        return form;
    }

    /**
     *Reloads windows
     */
    public refreshPage() {
        window.location.reload(true);
    }

    onZustellNachnahmeChange() {
        if (!this.isZustellNachnahme) {
            this.zustellNachnahmeWertModel = '';
        }
    }

    private checkNachnahmeWert(form: NgForm) {
        if (form.value.zustellNachnahmeWert > 2500) {
            this.zustellNachnahmeErrorMessage = 'Der Wert darf nicht mehr als 2500 EUR betragen.';
            return false;
        } else {
            this.zustellNachnahmeErrorMessage = '';
        }
        return true;
    }

    private setupPriceList() {
        this.subs.push(this.$dashboardService.getPriceConfig().subscribe(() => {
            this.priceList = this.$dashboardService.priceConfig$.getValue();
        }));
    }

    /**
     * Mapps the data
     *
     * @param form
     */
    private static prepareTemplateData(form: NgForm): User {
        let empfaenger: User = {};


        empfaenger.firma = form.value.empfFirma;
        empfaenger.zusatz = form.value.empfZusatz;
        empfaenger.ansprechpartner = form.value.empfAnsprechpartner;
        empfaenger.adresse = form.value.empfAdresse;
        empfaenger.land = form.value.empfLand;
        empfaenger.plz = form.value.empfPlz;
        empfaenger.ort = form.value.empfOrt;
        empfaenger.telefon = form.value.empfTel;
        empfaenger.email = form.value.empfEmail;


        return empfaenger;

    }
}
