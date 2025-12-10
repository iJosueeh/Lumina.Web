import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/auth/services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  errorMessage = '';
  returnUrl = '';
  sessionExpired = false;

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    this.sessionExpired = this.route.snapshot.queryParams['sessionExpired'] === 'true';

    if (this.sessionExpired) {
      this.errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login exitoso:', response);
        console.log('Rol principal:', response.userInfo.rolPrincipal);

        this.snackBar.open('¡Inicio de sesión exitoso!', 'Cerrar', { duration: 3000, verticalPosition: 'top' });

        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.redirectToDashboard(response.userInfo.rolPrincipal);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Credenciales inválidas. Por favor, intenta de nuevo.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private redirectToDashboard(role?: string): void {
    const userRole = (role || this.authService.getUserRole())?.toUpperCase();
    console.log('Redirigiendo para rol (normalizado):', userRole);

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
        console.warn('Rol no reconocido o sin dashboard específico:', userRole);
        this.router.navigate(['/home']);
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}