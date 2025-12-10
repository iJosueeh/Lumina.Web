import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/auth/services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterRequest } from '../../../core/models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  errorMessage = '';

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }

    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.registerForm.value;

    // Preparar el payload con valores por defecto para campos no solicitados
    const registerData: RegisterRequest = {
      nombres: formValue.nombres,
      apellidoPaterno: formValue.apellidoPaterno,
      apellidoMaterno: formValue.apellidoMaterno,
      correo: formValue.correo,
      password: formValue.password,
      fechaNacimiento: '2000-01-01', // Valor temporal
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'Lima',
      calle: 'Por definir'
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open('¡Registro exitoso! Bienvenido a Academia Pro', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });

        this.redirectToDashboard(response.userInfo.rolPrincipal);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error al registrar. Por favor, intenta de nuevo.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private redirectToDashboard(role?: string): void {
    const userRole = (role || this.authService.getUserRole())?.toUpperCase();

    switch (userRole) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'TEACHER':
        this.router.navigate(['/profesional/dashboard']);
        break;
      case 'STUDENT':
        this.router.navigate(['/estudiante/dashboard']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }

  get nombres() {
    return this.registerForm.get('nombres');
  }

  get apellidoPaterno() {
    return this.registerForm.get('apellidoPaterno');
  }

  get apellidoMaterno() {
    return this.registerForm.get('apellidoMaterno');
  }

  get correo() {
    return this.registerForm.get('correo');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
