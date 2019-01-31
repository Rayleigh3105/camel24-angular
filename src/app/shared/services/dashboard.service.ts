import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../core/models/user/user-model';
import {environment} from '../../../environments/environment.prod';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

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
