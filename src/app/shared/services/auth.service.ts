import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../../core/models/user/user-model';
import {environment} from '../../../environments/environment';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public currentUserSubject: BehaviorSubject<any>;


    constructor(private $http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    /**
     * Creates User and stores Auth Token in cookies
     * @param user - user to create
     */
    createUser(user: User) {
        return this.$http.post(environment.endpoint + 'user', user, {observe: 'response', responseType: 'json'})
            .pipe(
                map((response => {
                        // login successful if there's a jwt token in the response
                        // @ts-ignore
                        if (response.body.user) {
                            // store user details and jwt token in local storage to keep user logged in between page refreshes
                            // @ts-ignore
                            sessionStorage.setItem('currentUser', JSON.stringify(response.body.user));
                            // @ts-ignore
                            this.currentUserSubject.next(response.body.user);
                        }

                        return response;
                    })
                ));
    }

    /**
     * Login given user and creates cookie with auth token
     * @param user - user to login
     */
    loginUser(user: User) {
        return this.$http.post<User>(environment.endpoint + 'user/login', user, {observe: 'response', responseType: 'json'})
            .pipe(
                map((response => {
                        // login successful if there's a jwt token in the response
                        // @ts-ignore
                        if (response.body.user) {
                            // store user details and jwt token in local storage to keep user logged in between page refreshes
                            // @ts-ignore
                            sessionStorage.setItem('currentUser', JSON.stringify(response.body.user));
                            // @ts-ignore
                            this.currentUserSubject.next(response.body.user);
                        }

                        return response;
                    })
                ));
    }

    /**
     * Get´s current User
     */
    getCurrentUser(): Promise<User> {
        return this.$http.get<User>(environment.endpoint + 'user/me', this.updatexAuthHeader()).toPromise();
    }

    /**
     * Logs out User and removes token on Server
     */
    logoutUser() {
        return this.$http.delete(environment.endpoint + 'user/token', this.updatexAuthHeader()).pipe(
            map(() => {
                // remove user from local storage to log user out
                sessionStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
            })
        );
    }

    /**
     * Get´s current x-auth Token
     */
    updatexAuthHeader() {
        let headers = {
            'x-auth': sessionStorage.getItem('x-auth')
        };

        return {
            headers: new HttpHeaders(headers)
        };
    }

}
