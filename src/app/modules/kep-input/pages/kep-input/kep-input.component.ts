import { Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BestModalComponent} from '../../../../shared/components/best-modal/best-modal.component';
import {NgForm} from '@angular/forms';
import {SessionStorageComponent} from '../../../../shared/components/session-storage/session-storage.component';
import {InfoComponent} from '../info/info.component';

@Component({
    selector: 'camel-kep-input',
    templateUrl: './kep-input.component.html',
    styleUrls: ['./kep-input.component.scss']
})
export class KepInputComponent extends SessionStorageComponent implements OnInit {

    /**
     * VARIABLES
     */
    public minDate: Date = new Date();
    public maxDate: Date = new Date();
    public shouldUhrGetDisplayed: boolean = false;
    public shouldManuellDisplayed: boolean = false;
    public de: any;

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
    public sessionEmail: string;
    public landSelected: string = 'Deutschland';
    public rechnungSelected: string = 'absender';
    public artSelected: string = 'Waffe';
    public kiloSelected: string = '3,00 kg';
    public versicherungSelected: string = 'Nein';
    public zustellungsTerminSelected: string = 'Standardzustellungstermin';
    public sonderdienstSelected: string = 'Standardzustellung';



    constructor(private modalService: NgbModal) {
        super();
    }

    /**
     * Set´s up Datepicker logic for PrimeNG component
     */
    setupDatePicker() {
        this.de = {
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

        // TODO - IMPLEMENT LOGIC FOR CALCULATING THE DATE THE RIGHT WAY
        // Logic for calculating date
        this.minDate.setDate(this.minDate.getDate() + 1);
        if (this.minDate.getDay() === 5) {
            this.maxDate.setDate(this.minDate.getDate() + 16);
        } else if (this.minDate.getDay() === 4 || this.minDate.getDay() === 3 || this.minDate.getDay() === 2 || this.minDate.getDay() === 1) {
            this.maxDate.setDate(this.minDate.getDate() + 14);
        } else if (this.minDate.getDay() === 6) {
            this.maxDate.setDate(this.minDate.getDate() + 13);
        } else if (this.minDate.getDay() === 0) {
            this.maxDate.setDate(this.minDate.getDate() + 12);
        }
    }

    ngOnInit() {
        // Updates NgModel Variables
        this.updateNgModelVariablesWithSessionStorage();
        this.setupDatePicker();
        window.scroll(0, 0);

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
     * Checks if given string matches 'fixtermin' if yes a new selection is displayed
     * @param terminValue
     */
    onOptionChange(terminValue: string) {
        this.shouldUhrGetDisplayed = terminValue === 'fixtermin';
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
        if (form.form.valid) {
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
            // Delete KundenNummer from request body because it going to be sent with headers
            delete form.value.kundenNummer;
            // Delete Check from request body because it isnt needed for the request
            delete form.value.check;
            modalref.componentInstance.data = form.value;

        }
    }

    /**
     * Updated ngModel Attributes in Template with data given in Sessionstorage
     */
    updateNgModelVariablesWithSessionStorage() {
        this.sessionKundenNummer = SessionStorageComponent.getKundennummer();
        this.sessionFirmenName = SessionStorageComponent.getFirmenname();
        this.sessionZusatz = SessionStorageComponent.getZusatz();
        this.sessionAnsprechpartner = SessionStorageComponent.getAnsprechpartner();
        this.sessionAdresse = SessionStorageComponent.getAdresse();
        this.sessionLand = SessionStorageComponent.getLand();
        this.sessionPlz = SessionStorageComponent.getPlz();
        this.sessionOrt = SessionStorageComponent.getOrt();
        this.sessionTelefon = SessionStorageComponent.getTelefon();
        this.sessionEmail = SessionStorageComponent.getEmail();
    }

    /**
     * Opens info Modal - user is now able to view how the App is working
     */
    openInfoModal() {
        const modalRef = this.modalService.open(InfoComponent, {
            size: 'lg',
            backdrop: 'static',
        });
    }
}
