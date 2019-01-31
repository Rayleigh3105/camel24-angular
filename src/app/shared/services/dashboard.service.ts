import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../core/models/user/user-model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

    constructor(private $http: HttpClient) { }

    /**
     * Updates User with given values
     * @param user
     */
    updateUser( user : User ) {

    }
}
