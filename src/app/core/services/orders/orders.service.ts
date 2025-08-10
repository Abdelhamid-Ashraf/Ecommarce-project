import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private httpClient: HttpClient) {}
  checkoutPayment(id: string, data: object): Observable<any> {
    return this.httpClient.post(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${id}?url=http://localhost:4200`,
      {
        shippingAddress: data,
      }
    );
  }

  getUserOrders(id: string): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${id} `
    );
  }
}
