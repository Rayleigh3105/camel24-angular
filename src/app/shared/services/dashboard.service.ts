import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../core/models/user/user-model';
import {environment} from '../../../environments/environment.prod';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

    orders$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


    constructor(private $http: HttpClient) { }

    /**
     * Updates User with given values
     * @param user
     */
    updateUser( user : User ): Observable<User> {
        return this.$http.patch<User>( `${environment.endpoint}user/${user._id}`, user, this.updateXAuthfromSessionStorage())
            .pipe(
                tap( ( userDb ) => {
                })
            )
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

    updateXAuthfromSessionStorage() {
        let headers = {
            'x-auth': sessionStorage.getItem('x-auth')
        };

        let requestOptions = {
            headers: new HttpHeaders(headers)
        };

        return requestOptions;

    }
}
