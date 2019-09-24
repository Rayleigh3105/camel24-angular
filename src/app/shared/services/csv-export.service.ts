import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';
import {map} from 'rxjs/operators';
import {Template} from '../../core/models/user/template-model';

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
        if (kundenNummer && sessionStorage.getItem('x-auth')) {
            headers = {
                'x-kundenNummer': kundenNummer,
                'x-auth': sessionStorage.getItem('x-auth')
            };
        }
        return this.$http.post(environment.endpoint + 'order', order, {
            observe: 'response',
            responseType: 'text',
            headers: new HttpHeaders(headers)
        }).pipe(
            map(response => response.body)
        );
    }

    /**
     * Creates Template on the Server.
     *
     * @param template - current template to create on Server.
     */
    public createTemplate(template: Template): any {
        return this.$http.post(environment.endpoint + 'order/template', template, this.updateXAuthfromSessionStorage());
    }

    /**
     * Set`s up Request hedaer for dashboard requests
     */
    updateXAuthfromSessionStorage(filter?: string) {
        let headers;
        if (filter) {
            headers = {
                'x-auth': sessionStorage.getItem('x-auth'),
                'search': filter
            };
        } else {
            headers = {
                'x-auth': sessionStorage.getItem('x-auth')
            };

        }

        return {
            headers: new HttpHeaders(headers),
        };

    }

}
