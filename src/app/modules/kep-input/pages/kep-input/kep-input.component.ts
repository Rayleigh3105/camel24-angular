import { Component, OnInit } from '@angular/core';
import {Order} from '../../../../core/models/order/order-model';

@Component({
  selector: 'camel-kep-input',
  templateUrl: './kep-input.component.html',
  styleUrls: ['./kep-input.component.scss']
})
export class KepInputComponent implements OnInit {

    /**
     * VARIABLES
     */
    displayTimeSelectVar: boolean;
    minDate: Date = new Date();
    maxDate: Date = new Date();
    de: any;
    order: Order = new Order();


    constructor() {
        this.de = {
            firstDayOfWeek: 0,
            dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
            dayNamesShort: ["Son", "Mon", "Die", "Mit", "Do", "Fri", "Sam"],
            dayNamesMin: ["So","Mo","Di","Mi","Do","Fr","Sa"],
            monthNames: [ "Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
            today: 'Heute',
            clear: 'Löschen',
            dateFormat: 'dd.mm.yy'
        };

        this.minDate.setDate(this.minDate.getDate() + 1);
        if(this.minDate.getDay() === 4) {
            this.maxDate.setDate(this.minDate.getDate() +5)
        } else if (this.minDate.getDay() === 3) {
            this.maxDate.setDate(this.minDate.getDate() + 6);
        } else {
            this.maxDate.setDate(this.minDate.getDate() + 3);

        }
    }

  ngOnInit() {
  }


  onSubmit() {

  }
}
