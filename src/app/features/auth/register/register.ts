import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/auth/services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterRequest } from '../../../core/models/register-request';
import { environment } from '@environments/environment';
import { markFormGroupTouched, scrollToTop } from '@shared/utils/form.utils';
import { redirectToDashboard } from '@core/utils/navigation.utils';
import { passwordMatchValidator } from '@shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  portalUrl = environment.portalUrl;

  registerForm: FormGroup;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  constructor() {
    if (this.authService.checkIsAuthenticated()) {
      redirectToDashboard();
    }

    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  ngOnInit(): void {
    scrollToTop();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const formValue = this.registerForm.value;

    const registerData: RegisterRequest = {
      nombres: formValue.nombres,
      apellidoPaterno: formValue.apellidoPaterno,
      apellidoMaterno: formValue.apellidoMaterno,
      correo: formValue.correo,
      password: formValue.password,
      fechaNacimiento: '2000-01-01',
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'Lima',
      calle: 'Por definir'
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.snackBar.open('¡Registro exitoso! Bienvenido a Academia Pro', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });

        redirectToDashboard(response.userInfo.rolPrincipal);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Error al registrar. Por favor, intenta de nuevo.');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(v => !v);
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
