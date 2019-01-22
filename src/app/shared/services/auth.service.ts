import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {User} from '../../core/models/user/user-model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private $http: HttpClient) { }

    /**
     * Creates User and stores Auth Token in cookies
     * @param user - user to create
     */
  createUser( user: User )  {
      return this.$http.post( environment.endpoint + "user", user , {observe: 'response', responseType: 'json'})
          .pipe(
              map(  response => response.body)
          )
  }

    /**
     * Login given user and creates cookie with auth token
     * @param user - user to login
     */
  loginUser( user: User ) {
      return this.$http.post<User>( environment.endpoint + "user/login", user , {observe: 'response', responseType: 'json'})
          .pipe(
              map(  response => response.body)
          );
  }

    /**
     * Get´s current User
     */
  getCurrentUser(): Promise<User> {
    return this.$http.get<User>( environment.endpoint + "user/me", this.updatexAuthHeader()).toPromise()
  }

    /**
     * Logs out User and removes token on Server
     */
  logoutUser() {
        return this.$http.delete(environment.endpoint + "user/me/token", this.updatexAuthHeader() )
  }

    /**
     * Get´s current x-auth Token
     */
  updatexAuthHeader() {
    let headers = {
      'x-auth': sessionStorage.getItem('x-auth')
    };

    let requestOptions = {
      headers: new HttpHeaders(headers)
    };

    return requestOptions
  }

}
