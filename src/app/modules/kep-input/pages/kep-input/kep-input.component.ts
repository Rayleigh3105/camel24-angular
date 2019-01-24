import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BestModalComponent} from '../../../../shared/components/best-modal/best-modal.component';
import {NgForm} from '@angular/forms';
import {SessionStorageComponent} from '../../../../shared/components/session-storage/session-storage.component';

@Component({
    selector: 'camel-kep-input',
    templateUrl: './kep-input.component.html',
    styleUrls: ['./kep-input.component.scss']
})
export class KepInputComponent extends SessionStorageComponent implements OnInit {

    /**
     * VARIABLES
     */
    minDate: Date = new Date();
    maxDate: Date = new Date();
    shouldDisplayed: boolean = false;
    de: any;

    // NGMODEL
    sessionFirmenName: string;
    sessionKundenNummer: string;
    sessionZusatz: string;
    sessionAnsprechpartner: string;
    sessionAdresse: string;
    sessionLand: string;
    sessionPlz: string;
    sessionOrt: string;
    sessionTelefon: string;
    sessionEmail: string;


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

        // Logic for calculating date
        this.minDate.setDate(this.minDate.getDate() + 3);
        if (this.minDate.getDay() === 5) {
            this.maxDate.setDate(this.minDate.getDate() + 16);
        } else if (this.minDate.getDay() === 4 || this.minDate.getDay() === 3 || this.minDate.getDay() === 2 || this.minDate.getDay() === 1) {
            this.maxDate.setDate(this.minDate.getDate() + 14);
        } else if( this.minDate.getDay() === 6){
            this.maxDate.setDate(this.minDate.getDate() + 13);
        } else if(this.minDate.getDay() === 0) {
            this.maxDate.setDate(this.minDate.getDate() + 12);
        }
    }

    ngOnInit() {
        // Updates NgModel Variables
        this.updateNgModelVariablesWithSessionStorage();
        this.setupDatePicker();
    }

    /**
     * Checks if given string matches 'fixtermin' if yes a new selection is displayed
     * @param terminValue
     */
    protected onOptionChange(terminValue: string) {
        this.shouldDisplayed = terminValue === 'fixtermin';
    }

    /**
     * When Form is valid and KundeNummer is given opens the Confirmation Modal
     * @param form - form which is submitted
     */
    protected onSubmit(form: NgForm) {
        if (form.form.valid && form.value.kundenNummer || this.sessionKundenNummer) {
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
            modalref.componentInstance.data = form.value;
        }
    }

    /**
     * Updated ngModel Attributes in Template with data given in Sessionstorage
     */
    public updateNgModelVariablesWithSessionStorage() {
        this.sessionKundenNummer = this.getKundennummer();
        this.sessionFirmenName = this.getFirmenname();
        this.sessionZusatz = this.getZusatz();
        this.sessionAnsprechpartner = this.getAnsprechpartner();
        this.sessionAdresse = this.getAdresse();
        this.sessionLand = this.getLand();
        this.sessionPlz = this.getPlz();
        this.sessionOrt = this.getOrt();
        this.sessionTelefon = this.getTelefon();
        this.sessionEmail = this.getEmail();
    }
}
