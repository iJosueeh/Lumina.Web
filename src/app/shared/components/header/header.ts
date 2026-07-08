import { CommonModule } from '@angular/common';
import { Component, inject, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '@environments/environment';
import { Auth } from '@app/core/auth/services/auth';
import { NavItem } from '@app/core/models/nav-item';
import { CursosService } from '@app/core/services/cursos.service';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(Auth);
  private router = inject(Router);
  cursosService = inject(CursosService);

  mobileMenuOpen = signal(false);
  dropdownOpen = signal(false);
  cursosDropdownOpen = signal(false);
  cartCount = signal(0);
  portalUrl = environment.portalUrl;

  portalNavItems: NavItem[] = [];

  navItems: NavItem[] = [
    { label: 'Nosotros', route: '/sobre-nosotros' },
    { label: 'Eventos', route: '/noticias-eventos' },
    { label: 'Contacto', route: '/contacto' }
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  toggleCursosDropdown(): void {
    this.cursosDropdownOpen.update(v => !v);
  }

  closeCursosDropdown(): void {
    this.cursosDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const clickedInsideCursos = target.closest('.cursos-dropdown');
    if (!clickedInsideCursos && this.cursosDropdownOpen()) {
      this.cursosDropdownOpen.set(false);
    }

    const clickedInsideDropdown = target.closest('.accesos-dropdown');
    if (!clickedInsideDropdown && this.dropdownOpen()) {
      this.dropdownOpen.set(false);
    }
  }

  onLogin(): void {
    window.open(this.portalUrl, '_blank', 'noopener,noreferrer');
  }

  onLogout(): void {
    this.authService.logout();
  }
}