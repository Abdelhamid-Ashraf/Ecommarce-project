import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/orders/orders.service';
import { IOrders } from '../../shared/interfaces/iorders';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allorders',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss',
})
export class AllordersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);

  allOrders: IOrders[] = [];

  ngOnInit(): void {
    this.userOrders();
  }

  userOrders(): void {
    let id: any = localStorage.getItem('cartOwner');
    this.ordersService.getUserOrders(id).subscribe({
      next: (res) => {
        console.log(res);
        this.allOrders = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  goDetails(id: string): void {
    localStorage.setItem('prodId', id);
    this.router.navigate(['./details']);
  }
}
