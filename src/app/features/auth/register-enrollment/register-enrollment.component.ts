import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { ErrorHandlerService } from '@app/core/services/error-handler.service';
import { RegisterWithEnrollmentRequest } from '@app/core/models/register-request';
import { CursoService } from '@app/features/cursos/services/curso.service';

@Component({
  selector: 'app-register-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-enrollment.component.html',
  styleUrls: ['./register-enrollment.component.css']
})
export class RegisterEnrollmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cursoService = inject(CursoService);

  registerForm!: FormGroup;
  selectedCarreraId = signal<string | null>(null);
  carreras = signal<Array<{id: string, nombre: string}>>([]); // Lista de cursos disponibles
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  generatedPassword = signal<string | null>(null);
  showGeneratePasswordOption = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  ngOnInit(): void {
    // Obtener carreraId de query params si viene de un curso específico
    this.route.queryParams.subscribe(params => {
      if (params['carreraId']) {
        this.selectedCarreraId.set(params['carreraId']);
      }
    });

    // Cargar la lista de cursos disponibles
    this.loadCursos();
    
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      password: [''], // Opcional - se puede generar automáticamente
      confirmPassword: [''],
      carreraId: [this.selectedCarreraId() || '', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Escuchar cambios en el checkbox de generar contraseña
    this.registerForm.get('password')?.valueChanges.subscribe(value => {
      if (value && value.length > 0) {
        this.showGeneratePasswordOption.set(false);
      }
    });
  }

  private loadCursos(): void {
    this.cursoService.getAllCourses().subscribe({
      next: (cursos) => {
        // Mapear cursos a formato de carreras para compatibilidad
        const cursosFormateados = cursos.map(curso => ({
          id: curso.id,
          nombre: curso.titulo
        }));
        this.carreras.set(cursosFormateados);
      },
      error: () => {
        this.errorHandler.showErrorNotification('No se pudieron cargar los cursos disponibles');
        this.carreras.set([]);
      }
    });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    // Si ambos están vacíos, permitir (se generará contraseña)
    if (!password && !confirmPassword) {
      return null;
    }
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(v => !v);
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
    
    // Generar contraseña si no se proporcionó
    let password = formValue.password;
    if (!password || password.trim() === '') {
      password = this.generateSecurePassword();
      this.generatedPassword.set(password);
    }
    
    const request: RegisterWithEnrollmentRequest = {
      nombres: formValue.nombres,
      apellidoPaterno: formValue.apellidoPaterno,
      apellidoMaterno: formValue.apellidoMaterno,
      correo: formValue.correo,
      password: password,
      carreraId: formValue.carreraId || null
    };

    this.authService.registerWithEnrollment(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        
        let mensaje = '¡Registro exitoso! ';
        if (this.generatedPassword()) {
          mensaje += 'Tu contraseña ha sido generada automáticamente. ¡GUÁRDALA!';
        } else {
          mensaje += 'Ya puedes iniciar sesión con tu cuenta.';
        }
        this.successMessage.set(mensaje);
        
        this.errorHandler.showSuccessNotification(mensaje);
        
        // Redirigir al login después de 5 segundos (más tiempo si hay contraseña generada)
        const delay = this.generatedPassword() ? 8000 : 3000;
        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { registered: 'true' }
          });
        }, delay);
      },
      error: (error) => {
        this.loading.set(false);
        
        const errorInfo = this.errorHandler.handleHttpError(
          error,
          'Error al procesar el registro'
        );
        this.errorMessage.set(errorInfo.message);
      }
    });
  }

  generatePasswordAutomatically(): void {
    const password = this.generateSecurePassword();
    this.registerForm.patchValue({
      password: password,
      confirmPassword: password
    });
    this.generatedPassword.set(password);
    this.showGeneratePasswordOption.set(true);
  }

  private generateSecurePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  // Getters para template
  get nombres() { return this.registerForm.get('nombres'); }
  get apellidoPaterno() { return this.registerForm.get('apellidoPaterno'); }
  get apellidoMaterno() { return this.registerForm.get('apellidoMaterno'); }
  get correo() { return this.registerForm.get('correo'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get carreraId() { return this.registerForm.get('carreraId'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }
}
