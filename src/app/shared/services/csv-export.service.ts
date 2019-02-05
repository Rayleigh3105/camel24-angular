import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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
    public createCSVOnServer(order: any, kundenNummer?: string) {
        let headers;
        if(kundenNummer) {
            headers = {
                'x-kundenNummer': kundenNummer,
            };
        }

        return this.$http.post(environment.endpoint + 'csv', order, {observe: 'response', responseType: 'text', headers: new HttpHeaders(headers)})
            .pipe(
                map(response => response.body )
            );
    }
}
