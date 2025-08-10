import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private readonly httpClient: HttpClient) {}

  cartNum: WritableSignal<number> = signal(0);

  addProductToCart(id: string): Observable<any> {
    return this.httpClient.post(`${environment.cartUrl}`, { productId: id });
  }

  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(`${environment.cartUrl}`);
  }

  removeSpecificCartItem(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.cartUrl}/${id}`);
  }

  updateProductQuantity(id: string, newCount: number): Observable<any> {
    return this.httpClient.put(`${environment.cartUrl}/${id}`, {
      count: newCount,
    });
  }

  deleteUserCart(): Observable<any> {
    return this.httpClient.delete(`${environment.cartUrl}`);
  }
}
