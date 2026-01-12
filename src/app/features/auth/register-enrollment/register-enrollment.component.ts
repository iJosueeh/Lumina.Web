import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { CarreraService } from '@app/features/carreras/services/carrera.service';
import { ErrorHandlerService } from '@app/core/services/error-handler.service';
import { Carrera } from '@app/core/models/carrera';
import { RegisterRequest } from '@app/core/models/register-request';

@Component({
  selector: 'app-register-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-enrollment.component.html',
  styleUrl: './register-enrollment.component.css'
})
export class RegisterEnrollmentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly carreraService = inject(CarreraService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  registerForm!: FormGroup;
  carreras = signal<Carrera[]>([]);
  selectedCarreraId = signal<string | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  ngOnInit(): void {
    // Obtener carreraId de query params si viene de una carrera específica
    this.route.queryParams.subscribe(params => {
      if (params['carreraId']) {
        this.selectedCarreraId.set(params['carreraId']);
      }
    });

    this.initForm();
    this.loadCarreras();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      carreraId: [this.selectedCarreraId() || '', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private loadCarreras(): void {
    this.carreraService.getAllCarreras().subscribe({
      next: (carreras) => {
        this.carreras.set(carreras);
      },
      error: () => {
        const error = this.carreraService.error();
        if (error) {
          this.errorMessage.set(error.message);
        }
      }
    });
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
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValue = this.registerForm.value;
    const request: RegisterRequest = {
      nombres: formValue.nombres,
      apellidoPaterno: formValue.apellidoPaterno,
      apellidoMaterno: formValue.apellidoMaterno,
      correo: formValue.correo,
      password: formValue.password,
      carreraId: formValue.carreraId
    };

    this.authService.registerWithEnrollment(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response.message);
        
        this.errorHandler.showSuccessNotification(
          '¡Registro exitoso! Revisa tu email para confirmar tu cuenta.'
        );
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { registered: 'true' }
          });
        }, 3000);
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

  // Getters para template
  get nombres() { return this.registerForm.get('nombres'); }
  get apellidoPaterno() { return this.registerForm.get('apellidoPaterno'); }
  get apellidoMaterno() { return this.registerForm.get('apellidoMaterno'); }
  get correo() { return this.registerForm.get('correo'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get carreraId() { return this.registerForm.get('carreraId'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }
  
  // Exponer signals de CarreraService para el template
  get carrerasLoading() { return this.carreraService.loading(); }
  get carrerasError() { return this.carreraService.error(); }
}
