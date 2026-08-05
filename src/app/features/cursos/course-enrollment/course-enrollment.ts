import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { EstudiantesService } from '@app/core/services/estudiantes.service';
import { CursosService } from '@app/core/services/cursos.service';
import { CourseDetails } from '@app/core/models/course.model';
import { scrollToTop, markFormGroupTouched } from '@shared/utils/form.utils';
import { generateSecurePassword } from '@core/utils/password.utils';
import { environment } from '@environments/environment';

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
  readonly emailCheckLoading = signal(false);
  readonly emailCheckDone = signal(false);
  readonly enrollmentAttempted = signal(false);
  portalUrl = environment.portalUrl;

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

    // Restaurar usuario de localStorage antes de verificar isAuthenticated
    this.authService.loadCurrentUser();

    const cursoId = this.route.snapshot.paramMap.get('id');
    if (!cursoId) {
      this.cursoError.set('No se proporcionó un ID de curso válido.');
      this.loadingCurso.set(false);
      return;
    }

    // Si el usuario ya está autenticado, procesar inscripción automática y mostrar paso 2 (éxito)
    if (this.authService.isAuthenticated()) {
      const user = this.authService.currentUser();
      this.isExistingUser.set(true);
      this.successMessage.set(
        user
          ? `¡Hola ${user.nombre} ${user.apellido}! Procesando tu inscripción...`
          : '¡Bienvenido de vuelta! Procesando tu inscripción...'
      );
      this.loadCursoData(cursoId);
      // loadCursoData → onCursoLoaded → attemptEnrollment → goToStep(2)
      return;
    }

    // Si volvió del portal (sessionStorage tiene returnUrl ya consumido)
    const justReturned = sessionStorage.getItem('justReturnedFromPortal');
    if (justReturned) {
      sessionStorage.removeItem('justReturnedFromPortal');
      this.isExistingUser.set(true);
      this.successMessage.set('¡Bienvenido de vuelta! Procesando tu inscripción...');
      this.loadCursoData(cursoId);
      return;
    }

    this.loadCursoData(cursoId);
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
        // Si el usuario ya estaba autenticado O volvió del portal, iniciar inscripción automáticamente
        const isAuth = this.authService.isAuthenticated();
        const justReturned = !!sessionStorage.getItem('justReturnedFromPortal');
        if (isAuth || justReturned) {
          this.onCursoLoadedForAuthenticatedUser();
        }
      },
      error: () => {
        this.cursoError.set('No se pudo cargar la información del curso.');
        this.loadingCurso.set(false);
      },
    });
  }

  /**
   * Se llama desde loadCursoData cuando el usuario ya está autenticado.
   * Solo se ejecuta una vez (enrollmentAttempted actúa como guard).
   */
  onCursoLoadedForAuthenticatedUser(): void {
    if (this.enrollmentAttempted()) return;
    this.attemptEnrollmentForExistingUser();
  }

  // ─── Tab Toggle ──────────────────────────────────────────
  toggleAuthForm(): void {
    this.showLoginForm.update(v => !v);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  selectLoginTab(): void {
    this.enrollmentAttempted.set(false);
    this.showLoginForm.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  selectRegisterTab(): void {
    this.enrollmentAttempted.set(false);
    this.showLoginForm.set(false);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  // ─── Email Check ─────────────────────────────────────────
  checkEmail(): void {
    const emailControl = this.loginForm.get('email');
    if (!emailControl || !emailControl.value || emailControl.invalid) {
      return;
    }

    this.emailCheckLoading.set(true);
    this.errorMessage.set(null);

    this.authService.verificarUsuarioPorEmail(emailControl.value).subscribe({
      next: (exists) => {
        this.emailCheckLoading.set(false);
        this.emailCheckDone.set(true);
        if (exists) {
          this.isExistingUser.set(true);
          this.selectLoginTab();
        } else {
          this.isExistingUser.set(false);
          this.selectRegisterTab();
        }
      },
      error: () => {
        this.emailCheckLoading.set(false);
        this.emailCheckDone.set(true);
      },
    });
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
        this.isAuthenticating.set(false);
        this.attemptEnrollmentForExistingUser();
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

  /**
   * Para usuarios ya existentes que hicieron login.
   * Obtiene el estudianteId y crea la inscripcion + matricula automáticamente.
   */
  private attemptEnrollmentForExistingUser(): void {
    if (this.enrollmentAttempted()) return;
    this.enrollmentAttempted.set(true);

    const cursoData = this.curso();
    if (!cursoData?.id) {
      this.errorMessage.set('No se encontró información del curso.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.estudiantesService.enrollInCourse(cursoData.id).subscribe({
      next: (result) => {
        this.loading.set(false);
        if (!result || result.enrolled) {
          this.successMessage.set('¡Inscripción completada! Ya tienes acceso al curso.');
          setTimeout(() => this.goToStep(2), 1500);
        } else if (result.alreadyEnrolled) {
          this.successMessage.set('Ya estás inscrito en este curso. Puedes acceder desde tu portal.');
          setTimeout(() => this.goToStep(3), 1500);
        } else {
          // Falló silenciosamente (estudiante no existe, etc.)
          this.errorMessage.set(result.message || 'No se pudo completar la inscripción. Intenta nuevamente.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        // El servicio ya no lanza errores, devuelve {enrolled: false, ...}
        //所以 err viene del login, no del enrollment
        this.errorMessage.set('No se pudo completar la inscripción. Intenta nuevamente.');
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

    const email = this.registerForm.value.correoElectronico!;

    // Pre-check: verificar si el email ya existe antes de intentar registrar
    this.authService.verificarUsuarioPorEmail(email).subscribe({
      next: (exists) => {
        if (exists) {
          // El email ya existe → redirigir al tab de login con mensaje
          this.isAuthenticating.set(false);
          this.selectLoginTab();
          this.errorMessage.set('Este correo ya tiene una cuenta. Inicia sesión para continuar.');
          return;
        }
        // Email disponible → proseguir con registro
        this.doRegister();
      },
      error: () => {
        // Si falla el check, proseguir con registro (el backend validará)
        this.doRegister();
      }
    });
  }

  private doRegister(): void {
    const email = this.registerForm.value.correoElectronico!;
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
      correo: email,
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
        this.generatedPassword.set(password);
        this.successMessage.set(
          response?.message
            ? `¡Cuenta creada! ${response.message}`
            : '¡Cuenta creada exitosamente! Revisa tu correo para tus datos de acceso.'
        );
        this.isAuthenticating.set(false);
        // El backend ya creó inscripcion + matricula → ir directo a confirmación
        setTimeout(() => this.goToStep(2), 1500);
      },
      error: (error) => {
        this.isAuthenticating.set(false);
        if (error.status === 400 || error.status === 409) {
          this.errorMessage.set(error.error?.message || 'El correo ya está registrado. Intenta iniciar sesión.');
          this.currentStep.set(0);
          this.selectLoginTab();
        } else {
          this.errorMessage.set('Error al crear la cuenta. Por favor intenta nuevamente.');
        }
      },
    });
  }

  // ─── Step Navigation ─────────────────────────────────────
  private goToStep(step: number): void {
    if (step === 0) {
      this.enrollmentAttempted.set(false);
    }
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

  goToPortalLogin(): void {
    const currentUrl = window.location.pathname + window.location.search;
    const encodedUrl = encodeURIComponent(currentUrl);
    const portalLoginUrl = `${this.portalUrl}?returnUrl=${encodedUrl}`;
    window.location.href = portalLoginUrl;
  }

  // ─── Complete Enrollment (Step 1 — ahora obsoleto, legado) ──────────
  completeEnrollment(): void {
    // El enrollment ya fue procesado:
    // - Usuarios existentes: attemptEnrollmentForExistingUser() → step 2
    // - Usuarios nuevos: processRegister() → step 2 (registro + enrollment via backend)
    // Solo avanzamos al paso final de confirmación
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.goToStep(3);
    }, 500); // Breve delay para mostrar feedback visual
  }

  goToStudentCourses(): void {
    const portalBase = this.portalUrl.replace('/login', '');
    const returnUrl = encodeURIComponent('/student/courses');
    window.location.href = `${portalBase}/login?returnUrl=${returnUrl}`;
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
