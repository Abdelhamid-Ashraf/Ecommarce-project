import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProducts } from '../../shared/interfaces/iproducts';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private subscriptions: Subscription = new Subscription();
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  productDetails: IProducts | null = null;

  ngOnInit(): void {
    this.showSpecificProduct();
  }

  showSpecificProduct(): void {
    let productId: any = localStorage.getItem('prodId');

    const sub = this.productsService.getSpecificProduct(productId).subscribe({
      next: (res) => {
        this.productDetails = res.data;
      },
    });
    this.subscriptions.add(sub);
  }

  addToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message);
          this.cartService.cartNum.set(res.numOfCartItems);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
