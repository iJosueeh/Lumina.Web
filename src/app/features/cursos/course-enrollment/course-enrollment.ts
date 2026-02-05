import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { CursoService } from '@app/features/cursos/services/curso.service';
import { CourseDetalles } from '@app/core/models/course-detalles';

interface EnrollmentStep {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-course-enrollment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-enrollment.html',
  styleUrls: ['./course-enrollment.css'],
})
export class CourseEnrollment implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(Auth);
  private cursoService = inject(CursoService);

  currentStep = 0;  // Comienza en 0 para el login/verificación
  curso: CourseDetalles | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  generatedPassword: string | null = null;
  
  // Estado del flujo
  isExistingUser = false;  // true si el usuario ya existe y se autenticó
  showLoginForm = true;    // true para mostrar login, false para registro
  isAuthenticating = false;

  steps: EnrollmentStep[] = [
    { id: 0, title: 'Verificación', description: 'Inicia sesión o crea tu cuenta' },
    { id: 1, title: 'Confirmación del Curso', description: 'Verifica la información' },
    { id: 2, title: 'Finalizar', description: 'Completa tu matrícula' }
  ];

  // Formulario de login (Step 0 - opción 1)
  loginForm: FormGroup;
  
  // Formulario de registro (Step 0 - opción 2)
  registerForm: FormGroup;

  constructor() {
    // Formulario de Login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Formulario de Registro
    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      password: [''],  // Opcional - se generará si está vacío
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      documento: ['', [Validators.required, Validators.minLength(8)]],
      fechaNacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      ciudad: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    const cursoId = this.route.snapshot.paramMap.get('id');
    if (cursoId) {
      this.loadCursoData(cursoId);
    }
  }

  loadCursoData(id: string): void {
    this.loading = true;
    this.cursoService.getCourseById(id).subscribe({
      next: (data) => {
        this.curso = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la información del curso.';
        this.loading = false;
      }
    });
  }

  // Alternar entre formulario de login y registro en Step 0
  toggleAuthForm(): void {
    this.showLoginForm = !this.showLoginForm;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Procesar Login (Step 0 - opción 1)
  processLogin(): void {
    if (!this.loginForm.valid) {
      this.markFormGroupTouched(this.loginForm);
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.isAuthenticating = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password, rememberMe: false }).subscribe({
      next: (response) => {
        this.isExistingUser = true;
        this.successMessage = `¡Bienvenido de vuelta! Ahora confirma tu matrícula al curso.`;
        this.isAuthenticating = false;
        
        // Avanzar al siguiente paso (confirmación del curso)
        setTimeout(() => {
          this.currentStep = 1;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
      },
      error: (error) => {
        this.isAuthenticating = false;
        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.status === 404) {
          this.errorMessage = 'No existe una cuenta con este correo. ¿Deseas crear una?';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Por favor intenta nuevamente.';
        }
      }
    });
  }

  // Procesar Registro (Step 0 - opción 2)
  processRegister(): void {
    if (!this.registerForm.valid) {
      this.markFormGroupTouched(this.registerForm);
      this.errorMessage = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.isAuthenticating = true;
    this.errorMessage = '';
    
    // Generar contraseña si no se proporcionó
    let password = this.registerForm.value.password;
    if (!password || password.trim() === '') {
      password = this.generateSecurePassword();
      this.generatedPassword = password;
    }

    const formData = this.registerForm.value;
    const registerData = {
      nombres: formData.nombres,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      correo: formData.correoElectronico,
      password: password,
      carreraId: this.curso?.id || null,
      fechaNacimiento: formData.fechaNacimiento,
      pais: 'Peru',
      departamento: formData.ciudad || 'Lima',
      provincia: formData.ciudad || 'Lima',
      distrito: formData.ciudad || 'Lima',
      calle: formData.direccion
    };

    this.authService.registerWithEnrollment(registerData).subscribe({
      next: (response) => {
        this.isExistingUser = false;
        this.successMessage = response?.message || '¡Cuenta creada exitosamente!';
        this.isAuthenticating = false;
        
        // Avanzar al paso de confirmación
        setTimeout(() => {
          this.currentStep = 1;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
      },
      error: (error) => {
        this.isAuthenticating = false;
        if (error.status === 400 || error.status === 409) {
          this.errorMessage = error.error?.message || 'El correo ya está registrado. Intenta iniciar sesión.';
        } else {
          this.errorMessage = 'Error al crear la cuenta. Por favor intenta nuevamente.';
        }
        console.error('Error en registro:', error);
      }
    });
  }

  nextStep(): void {
    this.errorMessage = '';
    
    if (this.currentStep === 0) {
      // No avanzar desde Step 0, deben usar login o registro
      return;
    }
    
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.errorMessage = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(step: number): boolean {
    // No permitir navegación manual en el nuevo flujo
    return false;
  }

  canNavigateToStep(step: number): boolean {
    return false;  // Deshabilitar navegación manual por ahora
  }

  completeEnrollment(): void {
    this.loading = true;
    this.errorMessage = '';

    if (!this.curso || !this.curso.id) {
      this.errorMessage = 'Error: No se encontró información del curso.';
      this.loading = false;
      return;
    }

    // Aquí deberías llamar al endpoint de matrícula
    // Por ahora simulamos el éxito
    setTimeout(() => {
      this.successMessage = this.isExistingUser 
        ? '¡Matrícula completada! Ya tienes acceso al curso en tu cuenta.' 
        : '¡Matrícula completada! Te enviamos los detalles de acceso a tu correo.';
      this.loading = false;
      this.currentStep = 3;  // Paso final
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  }

  cancelEnrollment(): void {
    if (confirm('¿Estás seguro de que deseas cancelar la matrícula?')) {
      this.router.navigate(['/cursos', this.curso?.id]);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para formulario de login
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }

  // Getters para formulario de registro
  get nombres() { return this.registerForm.get('nombres'); }
  get apellidoPaterno() { return this.registerForm.get('apellidoPaterno'); }
  get apellidoMaterno() { return this.registerForm.get('apellidoMaterno'); }
  get correoElectronico() { return this.registerForm.get('correoElectronico'); }
  get password() { return this.registerForm.get('password'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get documento() { return this.registerForm.get('documento'); }
  get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
  get direccion() { return this.registerForm.get('direccion'); }
  get ciudad() { return this.registerForm.get('ciudad'); }
  get codigoPostal() { return this.registerForm.get('codigoPostal'); }

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
}
