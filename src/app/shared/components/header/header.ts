import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '@environments/environment';
import { Auth } from '@app/core/auth/services/auth';
import { NavItem } from '@app/core/models/nav-item';
import { CarritoService } from '@app/features/estudiante/services/carrito.service';
import { CursoCategoria } from '@app/core/models/curso-categoria';
import { CarreraService } from '@app/features/carreras/services/carrera.service';
import { Carrera } from '@app/core/models/carrera';
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
  private carritoService = inject(CarritoService);
  private carreraService = inject(CarreraService);
  private cursoService = inject(CursoService);

  isAuthenticated = false;
  currentUser: any = null;
  mobileMenuOpen = false;
  dropdownOpen = false;
  carrerasDropdownOpen = false;
  cursosDropdownOpen = false; // Nuevo estado
  cartCount = 0;
  portalUrl = environment.portalUrl;

  carreras: Carrera[] = [];

  // Nuevas categorías para el dropdown de cursos
  cursosCategorias: CursoCategoria[] = [
    { nombre: 'Programación', icon: 'code' },
    { nombre: 'Diseño', icon: 'palette' },
    { nombre: 'Marketing', icon: 'trending-up' },
    { nombre: 'Data Science', icon: 'database' },
    { nombre: 'Negocios', icon: 'briefcase' }
  ];

  navItems: NavItem[] = [
    { label: 'Carreras', route: '/carreras' },
    { label: 'Cursos', route: '/cursos' }, // Nuevo item
    { label: 'Admisión', route: '/admision' },
    { label: 'Vida Lumina', route: '/vida-lumina' },
    { label: 'Nosotros', route: '/sobre-nosotros' },
    { label: 'Noticias y Eventos', route: '/noticias-eventos' },
    { label: 'Contacto', route: '/contacto' }
  ];

  ngOnInit(): void {
    this.loadCarreras();
    this.loadCursosCategorias();
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

  loadCarreras(): void {
    this.carreraService.getAllCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
      },
      error: () => {
        // El interceptor global ya maneja el error
        this.carreras = [];
      }
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
      error: () => {
        // El interceptor global ya maneja el error
        // Mantener categorías por defecto
      }
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

  toggleCarrerasDropdown(): void {
    this.carrerasDropdownOpen = !this.carrerasDropdownOpen;
    if (this.carrerasDropdownOpen) this.cursosDropdownOpen = false; // Cerrar el otro dropdown
  }

  closeCarrerasDropdown(): void {
    this.carrerasDropdownOpen = false;
  }

  // Métodos para el dropdown de Cursos
  toggleCursosDropdown(): void {
    this.cursosDropdownOpen = !this.cursosDropdownOpen;
    if (this.cursosDropdownOpen) this.carrerasDropdownOpen = false; // Cerrar el otro dropdown
  }

  closeCursosDropdown(): void {
    this.cursosDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check for Carreras
    const clickedInsideCarreras = target.closest('.carreras-dropdown');
    if (!clickedInsideCarreras && this.carrerasDropdownOpen) {
      this.carrerasDropdownOpen = false;
    }

    // Check for Cursos
    const clickedInsideCursos = target.closest('.cursos-dropdown');
    if (!clickedInsideCursos && this.cursosDropdownOpen) {
      this.cursosDropdownOpen = false;
    }
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    this.authService.logout();
  }
}