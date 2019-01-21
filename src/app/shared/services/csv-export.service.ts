import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Order} from '../../core/models/order/order-model';
import {environment} from '../../../environments/environment.prod';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CsvExportService {

    constructor(private $http: HttpClient) {
    }

    /**
     * Creates CSV file on the Server
     * @param order
     * @param kundenNummer
     */
    public createCSVOnServer(order: any, kundenNummer: string) {
        let headers = {
            'x-kundenNummer': kundenNummer,
        };
        return this.$http.post(environment.endpoint + 'csv', order, {observe: 'response', responseType: 'json', headers: new HttpHeaders(headers)})
            .pipe(
                map(response => response.body)
            );
    }

    /**
     * Maps data to {@link Order}
     * @param data which is going to be mapped
     */
    public map(data): Order {
        let order = new Order();
        // Absender
        order.absender.firma = data.absFirma;
        order.absender.zusatz = data.absZusatz;
        order.absender.ansprechpartner = data.absAnsprechpartner;
        order.absender.addresse = data.absAdresse;
        order.absender.land = data.absLand;
        order.absender.plz = data.absPlz;
        order.absender.ort = data.absOrt;
        order.absender.telefon = data.absTel;

        // Empfänger
        order.empfaenger.firma = data.empfFirma;
        order.empfaenger.zusatz = data.empfZusatz;
        order.empfaenger.ansprechpartner = data.empfAnsprechpartner;
        order.empfaenger.addresse = data.empfAdresse;
        order.empfaenger.land = data.empfLand;
        order.empfaenger.plz = data.empfPlz;
        order.empfaenger.ort = data.empfOrt;
        order.empfaenger.telefon = data.empfTel;

        //  Abholtermin
        order.abholTermin.datum = data.abholDatum;

        // Zustelltermin
        order.zustellTermin.termin = data.zustellTermin;
        order.zustellTermin.zeit = data.fixtermin;

        //Sendungsdaten
        order.sendungsdaten.wert = data.sendungsdatenWert;
        order.sendungsdaten.gewicht = data.sendungsdatenGewicht;
        order.sendungsdaten.art = data.sendungsdatenArt;
        order.sendungsdaten.transportVers = data.sendungsdatenVers;

        // Rechnungsdaten
        order.rechnungsdaten.telefon = data.auftragbestTelefon;
        order.rechnungsdaten.email = data.auftragbestEmail;
        order.rechnungsdaten.rechnungsadresse = data.auftragsbestRechnungsadresse;

        return order;
    }
}
