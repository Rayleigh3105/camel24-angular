import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Order} from '../../core/models/order/order-model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    constructor(private $http: HttpClient) { }

    /**
     * Creates order based on the given value
     *
     * @param order - data
     */
    createOrder( order : Order ): Observable<Order> {
        return this.$http.post<Order>(environment.endpoint + "/order", order)
            .pipe(
                tap( ( orderDB ) => {

                })
            );

    }
}
