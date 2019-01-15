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

  createUser( user: User )  {
      return this.$http.post<User>( environment.endpoint + "user", user , {observe: 'response'})
          .pipe(
              map( ( response: HttpResponse<User> ) => {
                  sessionStorage.setItem('x-auth', response.headers.get('x-auth'));
              })
          ).toPromise();
  }

  loginUser( user: User ) {
      return this.$http.post<User>( environment.endpoint + "user/login", user , {observe: 'response'})
          .pipe(
              map( ( response: HttpResponse<User> ) => {
                  sessionStorage.removeItem('x-auth');
                  sessionStorage.setItem('x-auth', response.headers.get('x-auth'));
              })
          ).toPromise();
  }

  getCurrentUser(): Promise<User> {
    return this.$http.get<User>( environment.endpoint + "user/me", this.updatexAuthHeader()).toPromise()
  }

  logoutUser() {
        return this.$http.delete(environment.endpoint + "users/me/token", this.updatexAuthHeader() )
  }

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
