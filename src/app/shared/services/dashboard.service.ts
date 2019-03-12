import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../../core/models/user/user-model';
import {environment} from '../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ResponseContentType} from '@angular/http';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    orders$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

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
        return this.$http.get<any[]>(`${environment.endpoint}orders`, this.updateXAuthfromSessionStorage())
            .pipe(
                tap(val => this.orders$.next(val))
            );
    }

    /**
     * Download Paketlabel
     *
     * @param identificationNumber
     */
    downloadPdf(identificationNumber) {
        return this.$http.post(`${environment.endpoint}download`, {identificationNumber}, {
            responseType: 'blob',
            headers: new HttpHeaders()
                .append('Content-Type', 'application/json')
                .append('x-auth', sessionStorage.getItem('x-auth')),
        }).pipe(
            tap((response) => response)
        );
    }

    /**
     * Set`s up Request hedaer for dashboard requests
     */
    updateXAuthfromSessionStorage() {
        let headers = {
            'x-auth': sessionStorage.getItem('x-auth')
        };

        return {
            headers: new HttpHeaders(headers),
        };

    }
}
