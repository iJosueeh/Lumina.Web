import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseDetails, Module } from '@app/core/models/course.model';
import { CursosService } from '@app/core/services/cursos.service';
import { Auth } from '@app/core/auth/services/auth';
import { ErrorHandlerService } from '@app/core/services/error-handler.service';
import { scrollToTop } from '@shared/utils/form.utils';

@Component({
  selector: 'app-course-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css',
})
export class CourseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private cursosService = inject(CursosService);
  private authService = inject(Auth);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);

  curso: CourseDetails | null = null;
  cursoId: string | null = null;
  enrollForm: FormGroup;
  loading = false;
  dataLoading = true;
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
    scrollToTop();
    this.isAuthenticated = this.authService.isAuthenticated();

    this.cursoId = this.route.snapshot.paramMap.get('id');
    if (this.cursoId) {
      this.loadCursoData(this.cursoId);
    }
  }

  loadCursoData(id: string): void {
    this.dataLoading = true;
    this.errorMessage = '';
    this.cursosService.getCourseById(id).subscribe({
      next: (data) => {
        this.curso = data;
        this.dataLoading = false;

        if (!data) {
          this.errorMessage = 'No se encontró el curso solicitado.';
          console.error('Curso no encontrado - ID:', id);
        }

        this.cdr.markForCheck();
      },
      error: (error) => {
        this.dataLoading = false;
        this.errorMessage = 'No se pudo cargar la información del curso. Por favor, intenta más tarde.';
        console.error('Error al cargar curso:', id, error);
        this.cdr.markForCheck();
      }
    });
  }

  toggleModule(module: Module): void {
    module.isExpanded = !module.isExpanded;
  }

  addToCartOrRedirect(): void {
    // Redirigir directamente a la página de matrícula sin verificar autenticación
    if (this.curso?.id) {
      console.log('Navegando a matrícula con ID:', this.curso.id);
      this.router.navigate(['/cursos/matricula', this.curso.id]);
    } else {
      console.error('No se puede navegar: curso.id no está disponible');
    }
  }

  get nombreCompleto() {
    return this.enrollForm.get('nombreCompleto');
  }

  get correoElectronico() {
    return this.enrollForm.get('correoElectronico');
  }
}