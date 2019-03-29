import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../../core/models/user/user-model';
import {environment} from '../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    orders$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    users$ : BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

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
     * Get´s all orders for specific user
     */
    getOrdersForUser(): Observable<any[]> {
        return this.$http.get<any[]>(`${environment.endpoint}order`, this.updateXAuthfromSessionStorage())
            .pipe(
                tap(val => this.orders$.next(val))
            );
    }

    /**
     * Get´s all orders for specific user
     */
    getOrdersForKundenNummer(kundenNummer: String): Observable<any[]> {
        return this.$http.get<any[]>(`${environment.endpoint}admindashboard/users/${kundenNummer}`, this.updateXAuthfromSessionStorage())
            .pipe(
                tap(val => this.orders$.next(val))
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
     * Finds order by filter
     * @param filter - string to search with
     */
    findOrdersByIdent(filter: string) {
        return this.$http.get<any[]>(`${environment.endpoint}order`, this.updateXAuthfromSessionStorage(filter))
            .pipe(
                tap(val => this.orders$.next(val))
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
