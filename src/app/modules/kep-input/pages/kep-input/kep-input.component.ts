import {Component, OnInit} from '@angular/core';
import {Order} from '../../../../core/models/order/order-model';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BestModalComponent} from '../../../../shared/components/best-modal/best-modal.component';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'camel-kep-input',
    templateUrl: './kep-input.component.html',
    styleUrls: ['./kep-input.component.scss']
})
export class KepInputComponent implements OnInit {

    /**
     * VARIABLES
     */
    minDate: Date = new Date();
    maxDate: Date = new Date();
    shouldDisplayed: boolean = false;
    sessionKundenNummer : string;
    de: any;



    constructor(private modalService: NgbModal) {
      this.setupDatePicker();
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

        this.minDate.setDate(this.minDate.getDate() + 1);
        if (this.minDate.getDay() === 4) {
            this.maxDate.setDate(this.minDate.getDate() + 5);
        } else if (this.minDate.getDay() === 3) {
            this.maxDate.setDate(this.minDate.getDate() + 6);
        } else {
            this.maxDate.setDate(this.minDate.getDate() + 3);

        }
    }

    ngOnInit() {
        this.sessionKundenNummer = sessionStorage.getItem('kundenNummer');
    }

    /**
     * Checks if given string matches 'fixtermin' if yes a new selection is displayed
     * @param terminValue
     */
    protected onOptionChange(terminValue : string) {
        this.shouldDisplayed = terminValue === 'fixtermin';
    }

    /**
     * When Form is valid it opens the Confirmation Modal
     * @param value
     */
    protected onSubmit(form : NgForm) {
        if(form.form.valid) {
            const modalref = this.modalService.open(BestModalComponent,{
                size: 'lg'
            });
            modalref.componentInstance.data = form.value ;
        }
    }

}
