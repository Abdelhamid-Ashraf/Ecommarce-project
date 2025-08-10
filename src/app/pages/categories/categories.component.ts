import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICategories } from '../../shared/interfaces/icategories';
import { IProducts } from '../../shared/interfaces/iproducts';
import { CategoriesService } from '../../core/services/categories/categories.service';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);

  categories: ICategories[] = [];
  products: IProducts[] = [];
  catID!: string;

  ngOnInit(): void {
    this.showAllCategories();
  }

  showAllCategories(): void {
    const sub = this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res.data);
        this.categories = res.data;
      },
    });
    this.subscriptions.add(sub);
  }

  goCatProd(id: string, name: string): void {
    localStorage.setItem('catId', id);
    localStorage.setItem('catName', name);
    this.router.navigate(['./cat-prod']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
