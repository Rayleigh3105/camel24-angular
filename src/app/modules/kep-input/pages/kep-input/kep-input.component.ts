import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BestModalComponent} from '../../../../shared/components/best-modal/best-modal.component';
import {NgForm} from '@angular/forms';
import {SessionStorageComponent} from '../../../../shared/components/session-storage/session-storage.component';
import {AuthService} from '../../../../shared/services/auth.service';
import {element} from 'protractor';

@Component({
    selector: 'camel-kep-input',
    templateUrl: './kep-input.component.html',
    styleUrls: ['./kep-input.component.scss']
})
export class KepInputComponent extends SessionStorageComponent implements OnInit {

    @ViewChild('myCalendar')
    public myCalendar: any;

    /**
     * VARIABLES
     */
    public minDate: Date = new Date();
    public minDateZustell: Date = new Date();
    public maxDate: Date = new Date();
    public abholDatum1: Date = new Date();
    public zustellDatum1: Date = new Date();
    public shouldManuellDisplayed: boolean = false;
    public deAbholZeit: any;
    public showDialog: boolean = false;
    public requestSuccessfully: boolean = false;
    public requestError: boolean = false;
    public abholErrorMessage: string;
    public zustellErrorMessage: string;
    public zustellNachnahmeErrorMessage: string;

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
    public sessionEmail: string;
    public empfLandSelected: string = 'Deutschland';
    public absLandSelected: string = 'Deutschland';
    public rechnungSelected: string = 'absender';
    public artSelected: string = 'Waffe';
    public kiloSelected: string = '3';
    public versicherungSelected: string = 'Nein';
    public sonderdienstSelected: string = 'persoenlichIdent';
    public abholZeitVon1: string = '08:00';
    public abholZeitBis1: string = '16:00';
    public zustellZeitVon1: string = '08:00';
    public zustellZeitBis1: string = '16:00';
    public isZustellNachnahme: boolean = false;
    public zustellNachnahmeWertModel: string;

    constructor(private modalService: NgbModal, private cdr: ChangeDetectorRef, protected $authService: AuthService) {
        super();
        this.updateNgModelVariablesWithSessionStorage();
    }

    ngOnInit() {
        window.scroll(0, 0);

        // Set´s up PrimeNg Date Picker
        this.setupAbholZeitDatePicker();

        let interval = setInterval(() => {
            if (SessionStorageComponent.getXAuth() !== null) {
                this.updateNgModelVariablesWithSessionStorage();
                if (this.sessionFirmenName !== null) {
                    clearInterval(interval);
                }
            }

        }, 1000);
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
        if (this.checkValidAbholZeitfenster(form) && this.checkValidZustellZeitFenster(form) && form.form.valid && !this.checkZustellArtWithArtSendung(form) && this.checkNachnahmeWert(form)) {
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
     * Updated ngModel Attributes in Template with data given in Sessionstorage
     * Also updates Selected Values in form with default values
     */
    updateNgModelVariablesWithSessionStorage() {
        this.$authService.getCurrentUser().then(user => {
            this.sessionKundenNummer = user.kundenNummer.toString();
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
        });

    }

    /**
     * Opens info Modal - user is now able to view how the App is working
     */
    openInfoModal() {
        this.showDialog = true;
    }


    /**
     * Checks if AbholZeit is valid
     * @param form
     */
    private checkValidAbholZeitfenster(form: NgForm): boolean {
        let abholZeitVon = +form.value.abholZeitVon.substr(0, form.value.abholZeitVon.indexOf(':'));
        let abholZeitBis = +form.value.abholZeitBis.substr(0, form.value.abholZeitVon.indexOf(':'));

        if (abholZeitVon > abholZeitBis) {
            this.abholErrorMessage = 'Abholzeit \'von\' ist später als \'bis\' Abholzeit.';
            return false;
        } else if (!(abholZeitBis - 2 >= abholZeitVon)) {
            this.abholErrorMessage = 'Abholzeitfenster muss mind. 2 Stunden betragen.';
            return false;
        } else {
            this.abholErrorMessage = null;
            return true;
        }
    }

    /**
     * Checks if AbholZeit is valid
     * @param form
     */
    private checkValidZustellZeitFenster(form: NgForm): boolean {
        let zustellZeitVon = +form.value.zustellZeitVon.substr(0, form.value.abholZeitVon.indexOf(':'));
        let zustellZeitBis = +form.value.zustellZeitBis.substr(0, form.value.abholZeitVon.indexOf(':'));

        if (zustellZeitVon > zustellZeitBis) {
            this.zustellErrorMessage = 'Zustellzeit \'von\' ist später als \'bis\' Zustellzeit.';
            return false;
        } else if (!(zustellZeitBis - 2 >= zustellZeitVon)) {
            this.zustellErrorMessage = 'Zustellzeitfenster muss mind. 2 Stunden betragen.';
            return false;
        } else {
            this.zustellErrorMessage = null;
            return true;
        }
    }

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
        if (this.abholDatum1.getDay() === 5) {
            this.zustellDatum1.setDate(this.abholDatum1.getDate() + 3);
        } else {
            this.zustellDatum1.setDate(this.abholDatum1.getDate() + 1);
        }
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
        this.zustellNachnahmeErrorMessage = "Der Wert darf nicht mehr als 2500 EUR betragen."
        return false
      } else{
        this.zustellNachnahmeErrorMessage = ''
      }
      return true
  }
}
