import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  isLogin: InputSignal<boolean> = input<boolean>(true);
  countCart: Signal<number> = computed(() => this.cartService.cartNum());

  ngOnInit(): void {
    if (this.isLogin()) {
      this.cartService.getLoggedUserCart().subscribe({
        next: (res) => {
          this.cartService.cartNum.set(res.numOfCartItems);
        },
      });
    }
  }

  logOut(): void {
    this.authService.logoutUser();
  }
}
