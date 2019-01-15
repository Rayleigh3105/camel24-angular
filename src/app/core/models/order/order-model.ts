import {AbsEmpf} from './absempf-model';
import {Termin} from './termin-model';
import {SendungsDaten} from './sendungsdaten-model';

export interface Order {
    absender: AbsEmpf;
    empfaenger: AbsEmpf;
    abholTermin: Termin;
    zustellTermin: Termin;
    sendungsdaten : SendungsDaten;

}