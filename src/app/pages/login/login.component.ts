import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private subscriptions: Subscription = new Subscription();

  isLoading: boolean = false;
  isSuccess: string = '';

  loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [
      null,
      [Validators.required, Validators.pattern(/^[A-Z]\w{6,}$/)],
    ],
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const sub = this.authService
        .sendLoginForm(this.loginForm.value)
        .subscribe({
          next: (res) => {
            if (res.message === 'success') {
              setTimeout(() => {
                localStorage.setItem('token', res.token);
                this.authService.getUserData();
                this.router.navigate(['/home']);
              }, 500);
              this.isSuccess = res.message;
            }
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
          },
        });
      this.subscriptions.add(sub);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
