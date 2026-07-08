import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { EstudiantesService } from '@app/core/services/estudiantes.service';
import { CursosService } from '@app/core/services/cursos.service';
import { CourseDetails } from '@app/core/models/course.model';
import { scrollToTop, markFormGroupTouched } from '@shared/utils/form.utils';
import { generateSecurePassword } from '@core/utils/password.utils';

interface EnrollmentStep {
  id: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-course-enrollment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './course-enrollment.html',
  styleUrls: ['./course-enrollment.css'],
  host: {
    'class': 'block',
  },
})
export class CourseEnrollment implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(Auth);
  private estudiantesService = inject(EstudiantesService);
  private cursosService = inject(CursosService);

  // ─── State ───────────────────────────────────────────────
  readonly currentStep = signal(0);
  readonly curso = signal<CourseDetails | null>(null);
  readonly loadingCurso = signal(true);
  readonly cursoError = signal<string | null>(null);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly generatedPassword = signal<string | null>(null);

  readonly isExistingUser = signal(false);
  readonly showLoginForm = signal(true);
  readonly isAuthenticating = signal(false);

  // ─── Constants ───────────────────────────────────────────
  readonly steps: EnrollmentStep[] = [
    { id: 0, title: 'Verificación', description: 'Inicia sesión o crea tu cuenta' },
    { id: 1, title: 'Confirmación del Curso', description: 'Verifica la información' },
    { id: 2, title: 'Finalizar', description: 'Completa tu matrícula' },
  ];

  // ─── Derived State ───────────────────────────────────────
  readonly headerSubtitle = computed(() => {
    return this.currentStep() === 0
      ? 'Inicia sesión o crea una cuenta para matricularte en el curso'
      : 'Completa los siguientes pasos para matricularte en el curso';
  });

  readonly showNavButtons = computed(() => {
    const step = this.currentStep();
    return step > 0 && step < 3;
  });

  readonly showStep0BackButton = computed(() => this.currentStep() === 0);

  // ─── Forms ───────────────────────────────────────────────
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      password: [''],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      documento: ['', [Validators.required, Validators.minLength(8)]],
      fechaNacimiento: ['', [Validators.required]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      ciudad: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required]],
    });
  }

  // ─── Lifecycle ───────────────────────────────────────────
  ngOnInit(): void {
    scrollToTop();
    const cursoId = this.route.snapshot.paramMap.get('id');
    if (cursoId) {
      this.loadCursoData(cursoId);
    } else {
      this.cursoError.set('No se proporcionó un ID de curso válido.');
      this.loadingCurso.set(false);
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // ─── Data Loading ────────────────────────────────────────
  loadCursoData(id: string): void {
    this.loadingCurso.set(true);
    this.cursoError.set(null);

    this.cursosService.getCourseById(id).subscribe({
      next: (data) => {
        this.curso.set(data);
        this.loadingCurso.set(false);
      },
      error: () => {
        this.cursoError.set('No se pudo cargar la información del curso.');
        this.loadingCurso.set(false);
      },
    });
  }

  // ─── Tab Toggle ──────────────────────────────────────────
  toggleAuthForm(): void {
    this.showLoginForm.update(v => !v);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  selectLoginTab(): void {
    this.showLoginForm.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  selectRegisterTab(): void {
    this.showLoginForm.set(false);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  // ─── Login ───────────────────────────────────────────────
  processLogin(): void {
    if (!this.loginForm.valid) {
      markFormGroupTouched(this.loginForm);
      this.errorMessage.set('Por favor completa todos los campos.');
      return;
    }

    this.isAuthenticating.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password, rememberMe: false }).subscribe({
      next: () => {
        this.isExistingUser.set(true);
        this.successMessage.set('¡Bienvenido de vuelta! Ahora confirma tu matrícula al curso.');
        this.isAuthenticating.set(false);
        this.goToStep(1);
      },
      error: (error) => {
        this.isAuthenticating.set(false);
        if (error.status === 401) {
          this.errorMessage.set('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (error.status === 404) {
          this.errorMessage.set('No existe una cuenta con este correo. ¿Deseas crear una?');
        } else {
          this.errorMessage.set('Error al iniciar sesión. Por favor intenta nuevamente.');
        }
      },
    });
  }

  // ─── Register ────────────────────────────────────────────
  processRegister(): void {
    if (!this.registerForm.valid) {
      markFormGroupTouched(this.registerForm);
      this.errorMessage.set('Por favor completa todos los campos requeridos.');
      return;
    }

    this.isAuthenticating.set(true);
    this.errorMessage.set(null);

    let password = this.registerForm.value.password;
    if (!password || password.trim() === '') {
      password = generateSecurePassword();
      this.generatedPassword.set(password);
    }

    const formData = this.registerForm.value;
    const registerData = {
      nombres: formData.nombres,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      correo: formData.correoElectronico,
      password,
      carreraId: this.curso()?.id || null,
      fechaNacimiento: formData.fechaNacimiento,
      pais: 'Peru',
      departamento: formData.ciudad || 'Lima',
      provincia: formData.ciudad || 'Lima',
      distrito: formData.ciudad || 'Lima',
      calle: formData.direccion,
    };

    this.authService.registerWithEnrollment(registerData).subscribe({
      next: (response) => {
        this.isExistingUser.set(false);
        this.successMessage.set(response?.message || '¡Cuenta creada exitosamente!');
        this.isAuthenticating.set(false);
        this.goToStep(1);
      },
      error: (error) => {
        this.isAuthenticating.set(false);
        if (error.status === 400 || error.status === 409) {
          this.errorMessage.set(error.error?.message || 'El correo ya está registrado. Intenta iniciar sesión.');
        } else {
          this.errorMessage.set('Error al crear la cuenta. Por favor intenta nuevamente.');
        }
      },
    });
  }

  // ─── Step Navigation ─────────────────────────────────────
  private goToStep(step: number): void {
    this.currentStep.set(step);
    scrollToTop();
  }

  nextStep(): void {
    this.errorMessage.set(null);
    if (this.currentStep() < this.steps.length - 1) {
      this.goToStep(this.currentStep() + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      this.errorMessage.set(null);
      this.goToStep(this.currentStep() - 1);
    }
  }

  // ─── Enrollment ──────────────────────────────────────────
  completeEnrollment(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const cursoData = this.curso();
    if (!cursoData?.id) {
      this.errorMessage.set('Error: No se encontró información del curso.');
      this.loading.set(false);
      return;
    }

    if (this.isExistingUser()) {
      this.estudiantesService.enrollInCourse(cursoData.id).subscribe({
        next: (result) => {
          if (!result) {
            this.errorMessage.set('No se pudo completar la matrícula. Intenta nuevamente.');
            this.loading.set(false);
            return;
          }

          this.successMessage.set(
            result.alreadyEnrolled
              ? 'Ya estabas matriculado en este curso. Puedes ingresar desde tu panel.'
              : '¡Matrícula completada! Ya tienes acceso al curso en tu cuenta.'
          );
          this.loading.set(false);
          this.goToStep(3);
        },
        error: () => {
          this.errorMessage.set('No se pudo completar la matrícula. Intenta nuevamente.');
          this.loading.set(false);
        },
      });
      return;
    }

    // For new users: enrollment was processed during registration
    this.successMessage.set('¡Matrícula completada! Te enviamos los detalles de acceso a tu correo.');
    this.loading.set(false);
    this.goToStep(3);
  }

  cancelEnrollment(): void {
    if (confirm('¿Estás seguro de que deseas cancelar la matrícula?')) {
      this.router.navigate(['/cursos', this.curso()?.id]);
    }
  }

  // ─── Template Getters ────────────────────────────────────
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }

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
}
