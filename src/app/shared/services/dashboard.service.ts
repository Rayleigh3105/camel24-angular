import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../../core/models/user/user-model';
import {environment} from '../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {SmtpConfig} from '../../core/models/user/smtp-config';
import {PriceConfig} from '../../core/models/user/price-config';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    orders$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    priceConfig$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    constructor(private $http: HttpClient) {
    }

    /**
     * Updates User with given values
     * @param user
     */
    updateUser(user: User) {
        return this.$http.patch(`${environment.endpoint}user/${user._id}`, user, this.updateXAuthfromSessionStorage())
            .pipe(
                tap((response: Response) => response.body)
            );
    }

    /**
     * Download Paketlabel
     *
     * @param identificationNumber
     */
    downloadPdf(identificationNumber: string) {
        return this.$http.post(`${environment.endpoint}order/download`, {identificationNumber}, {
            responseType: 'blob',
            headers: new HttpHeaders()
                .append('Content-Type', 'application/json')
                .append('x-auth', sessionStorage.getItem('x-auth')),
        }).pipe(
            tap((response) => response)
        );
    }

    /**
     * ADMIN ROUTE - Get´s all Users with count of its orders
     */
    getAllUser(): Observable<any> {
        return this.$http.get<any[]>(`${environment.endpoint}admindashboard/users`, this.updateXAuthfromSessionStorage())
            .pipe(
                tap(val => this.users$.next(val))
            );
    }

    /**
     * ADMIN/PRIVATE ROUTE - Get´s all orders for specific user
     */
    getOrdersForKundenNummer(kundenNummer: String, filter: string): Observable<any[]> {
        return this.$http.get<any[]>(`${environment.endpoint}order/${kundenNummer}`, this.updateXAuthfromSessionStorage(filter))
            .pipe(
                tap(val => this.orders$.next(val))
            );
    }

    /**
     * ADMIN ROUTE - Finds user by filter
     * @param filter - string to search with
     */
    findUserByIKundenNummer(filter: string) {
        return this.$http.get<any[]>(`${environment.endpoint}admindashboard/users`, this.updateXAuthfromSessionStorage(filter))
            .pipe(
                tap(val => this.users$.next(val))
            );
    }

    /**
     * ADMIN ROUTE - Get Smtp options.
     */
    getSmtpConfig(): Promise<SmtpConfig> {
        return this.$http.get<SmtpConfig>(`${environment.endpoint}admindashboard/configSmtp`, this.updateXAuthfromSessionStorage()).toPromise();
    }

    /**
     * ADMIN ROUTE - Update SmtpOptions
     * @param config
     */
    updateSmtpConfiguration(config: SmtpConfig) {
        return this.$http.patch<SmtpConfig>(`${environment.endpoint}admindashboard/configSmtp`, config, this.updateXAuthfromSessionStorage());
    }

    /**
     * ADMIN / PRIVATE ROUTE - Get current Price configs
     */
    getPriceConfig(): Observable<any> {
        return this.$http.get<any>(`${environment.endpoint}admindashboard/priceConfig`).pipe(
            tap(val => this.priceConfig$.next(val))
        );
    }

    /**
     * ADMIN ROUTE - updates one price config
     * @param priceConfig
     */
    updatePriceConfig(priceConfig: PriceConfig): Observable<PriceConfig> {
        return this.$http.patch<PriceConfig>(`${environment.endpoint}admindashboard/priceConfig`, priceConfig, this.updateXAuthfromSessionStorage())
            .pipe(
                tap((priceConfigDb) => {
                    const priceList = [... this.priceConfig$.getValue()];
                    let index = priceList.indexOf(priceConfig);
                    if (index !== -1) {
                        priceList[index] = priceConfigDb;
                    }
                    this.priceConfig$.next(priceList);
                })
            );
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
