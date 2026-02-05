import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '@environments/environment';
import { Auth } from '@app/core/auth/services/auth';
import { NavItem } from '@app/core/models/nav-item';
import { CursoCategoria } from '@app/core/models/curso-categoria';
import { CursoService } from '@app/features/cursos/services/curso.service';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  private cursoService = inject(CursoService);

  isAuthenticated = false;
  currentUser: any = null;
  mobileMenuOpen = false;
  dropdownOpen = false;
  cursosDropdownOpen = false;
  cartCount = 0;
  portalUrl = environment.portalUrl;

  // Nuevas categorías para el dropdown de cursos
  cursosCategorias: CursoCategoria[] = [
    { nombre: 'Programación', icon: 'code' },
    { nombre: 'Diseño', icon: 'palette' },
    { nombre: 'Marketing', icon: 'trending-up' },
    { nombre: 'Data Science', icon: 'database' },
    { nombre: 'Negocios', icon: 'briefcase' }
  ];

  navItems: NavItem[] = [
    { label: 'Nosotros', route: '/sobre-nosotros' },
    { label: 'Eventos', route: '/noticias-eventos' },
    { label: 'Contacto', route: '/contacto' }
  ];

  ngOnInit(): void {
    this.loadCursosCategorias();
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  loadCursosCategorias(): void {
    this.cursoService.getCategorias().subscribe({
      next: (categorias) => {
        this.cursosCategorias = categorias.map(cat => ({
          nombre: cat,
          icon: this.getIconForCategoria(cat)
        }));
      },
    });
  }

  private getIconForCategoria(categoria: string): string {
    const iconMap: { [key: string]: string } = {
      'Programación': 'code',
      'Diseño': 'palette',
      'Marketing': 'trending-up',
      'Data Science': 'database',
      'Negocios': 'briefcase'
    };
    return iconMap[categoria] || 'book';
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

  // Métodos para el dropdown de Cursos
  toggleCursosDropdown(): void {
    this.cursosDropdownOpen = !this.cursosDropdownOpen;
  }

  closeCursosDropdown(): void {
    this.cursosDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check for Cursos dropdown
    const clickedInsideCursos = target.closest('.cursos-dropdown');
    if (!clickedInsideCursos && this.cursosDropdownOpen) {
      this.cursosDropdownOpen = false;
    }

    // Check for Accesos dropdown
    const clickedInsideDropdown = target.closest('.accesos-dropdown');
    if (!clickedInsideDropdown && this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }

  onLogin(): void {
    window.open('https://lumina-core-portal.pages.dev/login', '_blank', 'noopener,noreferrer');
  }

  onLogout(): void {
    this.authService.logout();
  }
}