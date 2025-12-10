import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { NavItem } from '@app/core/models/nav-item';
import { CarritoService } from '@app/features/estudiante/services/carrito.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  private carritoService = inject(CarritoService);

  isAuthenticated = false;
  currentUser: any = null;
  mobileMenuOpen = false;
  dropdownOpen = false;
  cartCount = 0;

  navItems: NavItem[] = [
    { label: 'Carreras', route: '/carreras' },
    { label: 'Admisión', route: '/admision' },
    { label: 'Vida Lumina', route: '/vida-lumina' },
    { label: 'Nosotros', route: '/sobre-nosotros' },
    { label: 'Noticias y Eventos', route: '/noticias-eventos' },
    { label: 'Contacto', route: '/contacto' }
  ];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      if (user) {
        this.loadCartCount();
      }
    });

    this.carritoService.cartItemCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  loadCartCount(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.carritoService.verCarrito(currentUser.id).subscribe(carrito => {
        this.carritoService.updateCartItemCount(carrito.cursoIds.length);
      });
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.authService.logout();
  }
}