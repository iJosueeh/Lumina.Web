import { Component, OnInit, inject, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { ErrorHandlerService } from '@app/core/services/error-handler.service';
import { RegisterWithEnrollmentRequest } from '@app/core/models/register-request';
import { LoginRequest } from '@app/core/models/login-request';
import { CursosService } from '@app/core/services/cursos.service';
import { environment } from '@environments/environment';
import { generateSecurePassword } from '@core/utils/password.utils';

@Component({
  selector: 'app-register-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-enrollment.component.html',
  styleUrls: ['./register-enrollment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterEnrollmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cursosService = inject(CursosService);
  private readonly cdr = inject(ChangeDetectorRef);

  registerForm!: FormGroup;
  selectedCarreraId = signal<string | null>(null);
  carreras = signal<Array<{id: string, nombre: string}>>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  generatedPassword = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['carreraId']) {
        this.selectedCarreraId.set(params['carreraId']);
      }
      this.cdr.markForCheck();
    });

    this.loadCursos();
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      correoConfirmacion: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      carreraId: [this.selectedCarreraId() || '', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: [this.passwordMatchValidator, this.emailMatchValidator]
    });
  }

  private loadCursos(): void {
    this.cursosService.getAllCourses().subscribe({
      next: (cursos) => {
        const cursosFormateados = cursos.map(curso => ({
          id: curso.id,
          nombre: curso.titulo
        }));
        this.carreras.set(cursosFormateados);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorHandler.showErrorNotification('No se pudieron cargar los cursos disponibles');
        this.carreras.set([]);
        this.cdr.markForCheck();
      }
    });
  }

  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (!password && !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private emailMatchValidator(form: AbstractControl): ValidationErrors | null {
    const correo = form.get('correo')?.value;
    const correoConfirmacion = form.get('correoConfirmacion')?.value;

    if (!correo || !correoConfirmacion) {
      return null;
    }

    return correo === correoConfirmacion ? null : { emailMismatch: true };
  }

  private splitApellidos(apellidos: string): { paterno: string; materno: string } {
    const parts = apellidos.trim().split(/\s+/);
    if (parts.length === 0) return { paterno: '', materno: 'No especificado' };
    if (parts.length === 1) return { paterno: parts[0], materno: 'No especificado' };
    return { paterno: parts[0], materno: parts.slice(1).join(' ') };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['email']) return 'Email inválido';
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set('Por favor completa todos los campos requeridos');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValue = this.registerForm.value;

    let password = formValue.password;
    if (!password || password.trim() === '') {
      password = generateSecurePassword();
      this.generatedPassword.set(password);
    }

    const { paterno, materno } = this.splitApellidos(formValue.apellidos);

    const request: RegisterWithEnrollmentRequest = {
      nombres: formValue.nombres,
      apellidoPaterno: paterno,
      apellidoMaterno: materno,
      correo: formValue.correo,
      password: password,
      carreraId: formValue.carreraId || null,
      cursoNombre: this.obtenerNombreCurso(formValue.carreraId)
    };

    this.authService.registerWithEnrollment(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.cdr.markForCheck();

        const loginRequest: LoginRequest = {
          email: formValue.correo,
          password: password,
          rememberMe: true
        };

        this.authService.login(loginRequest).subscribe({
          next: (loginResponse) => {
            const portalBase = environment.portalUrl.replace('/login', '');
            const userRole = loginResponse.userInfo.rolPrincipal?.toUpperCase();

            let redirectUrl = `${portalBase}/student`;
            if (userRole === 'ADMIN') {
              redirectUrl = `${portalBase}/admin`;
            } else if (userRole === 'TEACHER') {
              redirectUrl = `${portalBase}/teacher`;
            }

            let mensaje = '¡Registro y login exitosos! Redirigiendo al portal...';
            this.successMessage.set(mensaje);
            this.errorHandler.showSuccessNotification(mensaje);
            this.cdr.markForCheck();

            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1500);
          },
          error: (loginError) => {
            let mensaje = '¡Registro exitoso! Por favor inicia sesión.';
            if (this.generatedPassword()) {
              mensaje += ' Tu contraseña ha sido generada automáticamente.';
            }
            this.successMessage.set(mensaje);
            this.errorHandler.showSuccessNotification(mensaje);
            this.cdr.markForCheck();

            setTimeout(() => {
              this.router.navigate(['/login'], {
                queryParams: { registered: 'true' }
              });
            }, 3000);
          }
        });
      },
      error: (error) => {
        this.loading.set(false);

        const errorInfo = this.errorHandler.handleHttpError(
          error,
          'Error al procesar el registro'
        );
        this.errorMessage.set(errorInfo.message);
        this.cdr.markForCheck();
      }
    });
  }

  generatePasswordAutomatically(): void {
    const password = generateSecurePassword();
    this.registerForm.patchValue({
      password: password,
      confirmPassword: password
    });
    this.generatedPassword.set(password);
  }

  private obtenerNombreCurso(carreraId: string): string | null {
    if (!carreraId) return null;
    const curso = this.carreras().find(c => c.id === carreraId);
    return curso ? curso.nombre : null;
  }

  get nombres() { return this.registerForm.get('nombres'); }
  get apellidos() { return this.registerForm.get('apellidos'); }
  get correo() { return this.registerForm.get('correo'); }
  get correoConfirmacion() { return this.registerForm.get('correoConfirmacion'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get carreraId() { return this.registerForm.get('carreraId'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }
}
