import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';
import {map, tap} from 'rxjs/operators';
import {Template} from '../../core/models/user/template-model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CsvExportService {

    templates$: BehaviorSubject<Template[]> = new BehaviorSubject<Template[]>([]);


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
     * @param kundenNummer - current kundenNummer
     */
    public createTemplate(template: Template, kundenNummer: string): any {
        let headers;
        if (kundenNummer && sessionStorage.getItem('x-auth')) {
            headers = {
                'x-kundenNummer': kundenNummer,
                'x-auth': sessionStorage.getItem('x-auth')
            };
        }
        return this.$http.post(environment.endpoint + 'order/template', template, {
            observe: 'response',
            responseType: 'text',
            headers: new HttpHeaders(headers)
        });
    }

    /**
     * Get´s Templates from Server.
     *
     * @param kundenNummer - current number of the user.
     */
    public getTemplates(kundenNummer: string): any {
        let headers;
        if (kundenNummer && sessionStorage.getItem('x-auth')) {
            headers = {
                'x-kundenNummer': kundenNummer,
                'x-auth': sessionStorage.getItem('x-auth')
            };
        }
        return this.$http.get<Template[]>(environment.endpoint + 'order/template', {
            headers: new HttpHeaders(headers)
        })
            .pipe(
                tap(val => this.templates$.next(val))
            );
    }

    /**
     * Deletes Template with its ID on the Server and updates the BehaviourSubject.
     *
     * @param templateId - ID which is needed to delete the template.
     */
    public deleteTemplate(templateId: string): any {
        return this.$http.delete(environment.endpoint + `order/template/${templateId}`, this.updateXAuthfromSessionStorage())
            .pipe(
                tap(() => {
                    let templateList = [... this.templates$.getValue()];
                    let priceToDelete = templateList.find(template => template._id == templateId);
                    if (priceToDelete) {
                        templateList = templateList.filter(price => price._id != priceToDelete._id);
                    }

                    this.templates$.next(templateList);


                }));
    }

    /**
     * Update Template with its ID on the Server and Update Behavior Subject
     *
     * @param templateId - ID which is need to update the template
     * @param template - updated template
     */
    public updateTemplate(templateId: string, template: Template): any {
        return this.$http.patch<Template>(environment.endpoint + `order/template/${templateId}`, template, this.updateXAuthfromSessionStorage())
            .pipe(
                tap((templateDb) => {
                    let templateList = [... this.templates$.getValue()];
                    let index = templateList.findIndex(template => template._id == templateDb._id);
                    if (index !== -1) {
                        templateList[index] = templateDb;
                    }
                    this.templates$.next(templateList);
                })            );
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
