import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgotpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss',
})
export class ForgotpasswordComponent implements OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private subscriptions: Subscription = new Subscription();

  isLoading: boolean = false;
  // msgError: string = '';
  isSuccess: string = '';
  step: number = 1;

  verifyEmail: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
  });

  verifyCode: FormGroup = this.formBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^\w{6}$/)]],
  });

  resetPassword: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],

    newPassword: [
      null,
      [Validators.required, Validators.pattern(/^[A-Z]\w{6,}$/)],
    ],
  });

  submitVerifyEmail(): void {
    if (this.verifyEmail.valid) {
      this.isLoading = true;

      const sub = this.authService
        .setVerifyEmail(this.verifyEmail.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res.statusMsg === 'success') {
              setTimeout(() => {
                this.step = 2;
              }, 500);
              this.isSuccess = res.statusMsg;
            }
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            // this.msgError = err.error.message;
            this.isLoading = false;
          },
        });
      this.subscriptions.add(sub);
    } else {
      this.verifyEmail.markAllAsTouched();
    }
  }

  submitVerifyCode(): void {
    if (this.verifyCode.valid) {
      this.isLoading = true;

      const sub = this.authService
        .setVerifyCode(this.verifyCode.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res.status === 'Success') {
              setTimeout(() => {
                this.step = 3;
              }, 500);
              this.isSuccess = res.statusMsg;
            }
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            // this.msgError = err.error.message;
            this.isLoading = false;
          },
        });
      this.subscriptions.add(sub);
    } else {
      this.verifyCode.markAllAsTouched();
    }
  }

  submitResetPassword(): void {
    if (this.resetPassword.valid) {
      this.isLoading = true;

      const sub = this.authService
        .setResetPass(this.resetPassword.value)
        .subscribe({
          next: (res) => {
            console.log(res);

            if (res.token) {
              setTimeout(() => {
                localStorage.setItem('token', res.token);
                this.authService.getUserData();
                this.router.navigate(['/home']);
              }, 500);
              this.isSuccess = 'Success';
            }
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            // this.msgError = err.error.statusMsg;
            this.isLoading = false;
          },
        });
      this.subscriptions.add(sub);
    } else {
      this.resetPassword.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
