import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrdersService } from '../../core/services/orders/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  cartId: any;

  checkOutForm: FormGroup = this.formBuilder.group({
    details: [
      null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
    ],
    city: [
      null,
      [Validators.required, Validators.minLength(3), Validators.maxLength(15)],
    ],
  });

  submitForm(): void {
    this.cartId = localStorage.getItem('cart_id');
    // console.log(this.checkOutForm.value);
    // console.log(this.cartId);
    this.ordersService
      .checkoutPayment(this.cartId, this.checkOutForm.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            this.router.navigate(['./allorders']);
          }
        },
        error: (err) => {
          console.log(err);
          if (err) {
            this.router.navigate(['./cart']);
          }
        },
      });
  }
}
