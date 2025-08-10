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
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategories } from '../../shared/interfaces/icategories';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search/search.pipe';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, FormsModule, SearchPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly authService = inject(AuthService);

  private subscriptions: Subscription = new Subscription();

  products: WritableSignal<IProducts[]> = signal([]);
  categories: WritableSignal<ICategories[]> = signal([]);

  text: string = '';

  ngOnInit(): void {
    this.showAllProducts();
    this.showAllCategories();

    localStorage.setItem('cartOwner', this.authService.userData.id);
  }

  showAllProducts(): void {
    const sub = this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
      },
    });
    this.subscriptions.add(sub);
  }

  showAllCategories(): void {
    const sub = this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
      },
    });
    this.subscriptions.add(sub);
  }

  goDetails(id: string): void {
    localStorage.setItem('prodId', id);
    this.router.navigate(['./details']);
  }

  addToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.toastrService.success(res.message);
          this.cartService.cartNum.set(res.numOfCartItems);
        }
      },
    });
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
    nav: true,
  };

  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    navSpeed: 700,
    items: 1,
    nav: false,
  };

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
