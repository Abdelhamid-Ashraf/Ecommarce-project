import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  cartDetails: ICart = {} as ICart;

  ngOnInit(): void {
    this.getCartData();
  }

  getCartData(): void {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res.data;
        console.log(res.data.cartOwner);

        if (res.status === 'success') {
          localStorage.setItem('cartOwner', res.data.cartOwner);
        }
      },
    });
  }

  updateCount(id: string, count: number): void {
    this.cartService.updateProductQuantity(id, count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails = res.data;
        this.cartService.cartNum.set(res.numOfCartItems);
      },
    });
  }

  saveCartId(id: string): void {
    localStorage.setItem('cart_id', id);
  }

  removeItem(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#047857',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeSpecificCartItem(id).subscribe({
          next: (res) => {
            console.log(res);
            this.cartDetails = res.data;
            this.cartService.cartNum.set(res.numOfCartItems);

            Swal.fire({
              title: 'Deleted!',
              text: 'Item has been deleted.',
              icon: 'success',
            });
          },
        });
      }
    });
  }

  clearItems(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#047857',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteUserCart().subscribe({
          next: (res) => {
            console.log(res);
            if (res.message == 'success') {
              this.cartDetails = {} as ICart;
              this.cartService.cartNum.set(0);

              Swal.fire({
                title: 'Deleted!',
                text: 'Your items has been deleted.',
                icon: 'success',
              });
            }
          },
        });
      }
    });
  }
}
