import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/auth/services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '@environments/environment';
import { markFormGroupTouched, scrollToTop } from '@shared/utils/form.utils';
import { redirectToDashboard } from '@core/utils/navigation.utils';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  returnUrl = '';
  sessionExpired = false;

  constructor() {
    if (this.authService.checkIsAuthenticated()) {
      redirectToDashboard();
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    scrollToTop();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    this.sessionExpired = this.route.snapshot.queryParams['sessionExpired'] === 'true';

    if (this.sessionExpired) {
      this.errorMessage.set('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.cdr.markForCheck();
        console.log('Login exitoso:', response);
        console.log('Rol principal:', response.userInfo.rolPrincipal);

        this.snackBar.open('¡Inicio de sesión exitoso!', 'Cerrar', { duration: 3000, verticalPosition: 'top' });

        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          redirectToDashboard(response.userInfo.rolPrincipal);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Credenciales inválidas. Por favor, intenta de nuevo.');
        this.cdr.markForCheck();
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}