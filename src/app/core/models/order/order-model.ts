import {AbsEmpf} from './absempf-model';
import {Termin} from './termin-model';
import {SendungsDaten} from './sendungsdaten-model';
import {RechnungsDaten} from './rechnungsdaten-model';

export class Order {
    absender: AbsEmpf = new AbsEmpf();
    empfaenger: AbsEmpf = new AbsEmpf();
    abholTermin: Termin = new Termin();
    zustellTermin: Termin = new Termin();
    sendungsdaten : SendungsDaten = new SendungsDaten();
    rechnungsdaten: RechnungsDaten = new RechnungsDaten();
}