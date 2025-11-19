import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { NavItem } from '@app/core/models/nav-item';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);

  isAuthenticated = false;
  currentUser: any = null;
  mobileMenuOpen = false;

  navItems: NavItem[] = [
    { label: 'Inicio', route: '/home' },
    { label: 'Cursos', route: '/cursos' },
    { label: 'Sobre Nosotros', route: '/sobre-nosotros' },
    { label: 'Contacto', route: '/contacto' }
  ];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.authService.logout();
  }

  goToDashboard(): void {
    const role = this.authService.getUserRole();
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'PROFESIONAL':
        this.router.navigate(['/profesional/dashboard']);
        break;
      case 'ESTUDIANTE':
        this.router.navigate(['/estudiante/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }
}