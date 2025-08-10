import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  private readonly router = inject(Router);
  userData: any;

  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }

  getUserData(): void {
    if (localStorage.getItem('token')) {
      this.userData = jwtDecode(localStorage.getItem('token')!);
      console.log(jwtDecode(localStorage.getItem('token')!));
    }
  }

  logoutUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('cart_id');
    localStorage.removeItem('catId');
    localStorage.removeItem('catName');
    localStorage.removeItem('prodId');
    localStorage.removeItem('cartOwner');
    this.userData = null;
    this.router.navigate(['/login']);
  }

  //^ResetPassword
  setVerifyEmail(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }
  setVerifyCode(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      data
    );
  }
  setResetPass(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      data
    );
  }
}
