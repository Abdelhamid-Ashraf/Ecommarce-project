import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { Subscription } from 'rxjs';
import { IProducts } from '../../shared/interfaces/iproducts';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { BrandsService } from '../../core/services/brands/brands.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { IBrands } from '../../shared/interfaces/ibrands';

@Component({
  selector: 'app-products',
  imports: [FormsModule, SearchPipe, CarouselModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly brandsService = inject(BrandsService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  private subscriptions: Subscription = new Subscription();

  products: IProducts[] = [];
  brands: IBrands[] = [];
  pNum!: number;
  numOp!: number;
  text: string = '';

  ngOnInit(): void {
    this.showAllProducts();
    this.showAllBrands();
  }

  showAllProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.pNum = res.metadata.currentPage;
        this.numOp = res.metadata.numberOfPages;
      },
    });
  }

  showAllBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        console.log(res.data);
        this.brands = res.data;
      },
    });
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

  goDetails(id: string): void {
    localStorage.setItem('prodId', id);
    this.router.navigate(['./details']);
  }

  nextPage(): void {
    if (this.pNum < this.numOp) {
      const sub = this.productsService.getProductPage(this.pNum + 1).subscribe({
        next: (res) => {
          this.products = res.data;

          this.pNum = res.metadata.currentPage;
          this.numOp = res.metadata.numberOfPages;
        },
      });
      this.subscriptions.add(sub);
    }
  }
  prevPage(): void {
    if (this.pNum === this.numOp) {
      const sub = this.productsService.getProductPage(this.pNum - 1).subscribe({
        next: (res) => {
          this.products = res.data;

          this.pNum = res.metadata.currentPage;
          this.numOp = res.metadata.numberOfPages;
        },
      });
      this.subscriptions.add(sub);
    }
  }

  customOptions: OwlOptions = {
    loop: true,

    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-arrow-left-long "></i>',
      '<i class="fa-solid fa-arrow-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 3,
      },
      940: {
        items: 5,
      },
    },
    nav: false,
  };

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
