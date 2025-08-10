import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { IProducts } from '../../shared/interfaces/iproducts';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cat-prod',
  imports: [],
  templateUrl: './cat-prod.component.html',
  styleUrl: './cat-prod.component.scss',
})
export class CatProdComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  products: IProducts[] = [];
  cateId: any;
  catNam: any;

  ngOnInit(): void {
    this.showCatProds();
  }

  showCatProds(): void {
    this.cateId = localStorage.getItem('catId');
    this.catNam = localStorage.getItem('catName');

    const sub = this.productsService.getProdCat(this.cateId).subscribe({
      next: (res) => {
        console.log(res);

        this.products = res.data;
      },
    });
    this.subscriptions.add(sub);
  }

  goDetails(id: string): void {
    localStorage.setItem('prodId', id);
    this.router.navigate(['./details']);
  }

  addToCart(id: string): void {
    const sub = this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message);
          this.cartService.cartNum.set(res.numOfCartItems);
        }
      },
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
