import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseDetalles } from '@app/core/models/course-detalles';
import { Module } from '@app/core/models/module';
import { CursoService } from '@app/features/cursos/services/curso.service';
import { CarritoService } from '@app/features/estudiante/services/carrito.service';
import { Auth } from '@app/core/auth/services/auth';

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css',
})
export class CourseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private cursoService = inject(CursoService);
  private carritoService = inject(CarritoService);
  private authService = inject(Auth);
  private router = inject(Router);

  curso: CourseDetalles | null = null;
  enrollForm: FormGroup;
  loading = false;
  dataLoading = false;
  successMessage = '';
  errorMessage = '';
  isAuthenticated = false;

  constructor() {
    this.enrollForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.isAuthenticated = this.authService.isAuthenticated();

    const cursoId = this.route.snapshot.paramMap.get('id');
    if (cursoId) {
      this.loadCursoData(cursoId);
    }
  }

  loadCursoData(id: string): void {
    this.dataLoading = true;
    this.errorMessage = '';
    this.cursoService.getCourseById(id).subscribe({
      next: (data) => {
        this.curso = data;
        this.dataLoading = false;
      },
      error: () => {
        // El interceptor global ya maneja el error
        this.errorMessage = 'No se pudo cargar la información del curso. Por favor, intenta más tarde.';
        this.dataLoading = false;
      }
    });
  }

  toggleModule(module: Module): void {
    module.isExpanded = !module.isExpanded;
  }

  onAddToCart(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Debes iniciar sesión para agregar cursos al carrito.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const estudianteId = currentUser.id;
    const cursoId = this.curso?.id;

    if (!estudianteId || !cursoId) {
      this.errorMessage = 'No se pudo obtener la información del usuario o del curso.';
      this.loading = false;
      return;
    }

    this.carritoService.agregarCurso(estudianteId, cursoId).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = '¡Curso añadido a la cesta!';
        this.carritoService.verCarrito(estudianteId).subscribe(carrito => {
          this.carritoService.updateCartItemCount(carrito.cursoIds.length);
        });
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Hubo un error al agregar el curso a la cesta.';
        console.error('Error al agregar al carrito:', error);
        setTimeout(() => { this.errorMessage = ''; }, 3000);
      }
    });
  }

  addToCartOrRedirect(): void {
    if (this.isAuthenticated) {
      this.onAddToCart();
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get nombreCompleto() {
    return this.enrollForm.get('nombreCompleto');
  }

  get correoElectronico() {
    return this.enrollForm.get('correoElectronico');
  }
}