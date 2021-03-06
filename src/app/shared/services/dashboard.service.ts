import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../../core/models/user/user-model';
import {environment} from '../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {SmtpConfig} from '../../core/models/config/smtp-config';
import {PriceConfig} from '../../core/models/config/price-config';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    orders$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    priceConfig$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private rootUrl: String = "admindashboard/";
    private configMailUrl: String = this.rootUrl + "configMail";
    private priceOptionUrl: String = this.rootUrl + "priceOption";

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
        return this.$http.get<SmtpConfig>(`${environment.endpoint}${this.configMailUrl}`, this.updateXAuthfromSessionStorage()).toPromise();
    }

    /**
     * ADMIN ROUTE - Update SmtpOptions
     * @param config
     */
    updateSmtpConfiguration(config: SmtpConfig) {
        return this.$http.patch<SmtpConfig>(`${environment.endpoint}${this.configMailUrl}`, config, this.updateXAuthfromSessionStorage());
    }

    /**
     * ADMIN / PRIVATE ROUTE - Get current Price configs
     */
    getPriceConfig(): Observable<any> {
        return this.$http.get<any>(`${environment.endpoint}${this.priceOptionUrl}`).pipe(
            tap(val => this.priceConfig$.next(val))
        );
    }

    /**
     * ADMIN ROUTE - updates one price config
     * @param priceConfig
     */
    updatePriceConfig(priceConfig: PriceConfig): Observable<PriceConfig> {
        return this.$http.patch<PriceConfig>(`${environment.endpoint}${this.priceOptionUrl}`, priceConfig, this.updateXAuthfromSessionStorage())
            .pipe(
                tap((priceConfigDb) => {
                    let priceList = [... this.priceConfig$.getValue()];
                    let index = priceList.findIndex(price => price._id == priceConfigDb._id);
                    if (index !== -1) {
                        priceList[index] = priceConfigDb;
                    }
                    this.priceConfig$.next(priceList);
                })
            );
    }

    /**
     * Creates Price config on the backend.
     * @param price
     */
    createPriceConfig(price: PriceConfig) {
        return this.$http.post<PriceConfig>(`${environment.endpoint}${this.priceOptionUrl}`, price, this.updateXAuthfromSessionStorage())
            .pipe(
                tap((priceConfigDb) =>
                    this.priceConfig$.next([... this.priceConfig$.getValue(), priceConfigDb])
                )
            );
    }

    /**
     * Deletes price config on the backend.
     */
    deletePriceConfig(priceId: string) {
        return this.$http.delete(`${environment.endpoint}${this.priceOptionUrl}/${priceId}`, this.updateXAuthfromSessionStorage()).pipe(
            tap(() => {
                let priceList = [... this.priceConfig$.getValue()];
                let priceToDelete = priceList.find(price => price._id == priceId);
                if (priceToDelete) {
                   priceList = priceList.filter(price => price._id != priceToDelete._id);
                }

                this.priceConfig$.next(priceList)


            })
        )
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
