import { inject, Injectable, signal, computed } from '@angular/core';
import { AuthResponse } from '@app/core/models/auth-response';
import { LoginRequest } from '@app/core/models/login-request';
import {
  RegisterRequest,
  RegisterWithEnrollmentRequest,
  RegisterWithEnrollmentResponse,
  VerificarUsuarioResponse
} from '@app/core/models/register-request';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { CookieService } from '@app/core/services/cookie.service';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);

  private _currentUser = signal<AuthResponse['userInfo'] | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly userRole = computed(() => this._currentUser()?.rolPrincipal?.toUpperCase() ?? null);

  private readonly COOKIE_TOKEN_KEY = 'auth_token';
  private readonly GATEWAY_DOMAIN = 'localhost';

  /**
   * Restaura el usuario desde localStorage.
   * Llamar en ngOnInit de páginas que dependen de currentUser().
   */
  loadCurrentUser(): void {
    this.loadUserFromStorage();
  }

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this._currentUser.set(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al parsear usuario del localStorage', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  private saveTokenToCookie(token: string, days: number = 7): void {
    const domain = this.GATEWAY_DOMAIN;
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresStr = `expires=${expires.toUTCString()}`;
    
    document.cookie = `${this.COOKIE_TOKEN_KEY}=${token};${expiresStr};path=/;domain=${domain};SameSite=Lax`;
    console.log('✅ [AUTH] Token guardado en cookie para dominio:', domain);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      credentials,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.saveTokenToCookie(response.token);

        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }

        localStorage.setItem('currentUser', JSON.stringify(response.userInfo));
        this._currentUser.set(response.userInfo);

        if (credentials.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      })
    );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/register`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.saveTokenToCookie(response.token);

        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }

        localStorage.setItem('currentUser', JSON.stringify(response.userInfo));
        this._currentUser.set(response.userInfo);
      })
    );
  }

  /**
   * Registra un nuevo usuario y opcionalmente lo matricula en una carrera
   */
  registerWithEnrollment(data: RegisterWithEnrollmentRequest): Observable<RegisterWithEnrollmentResponse> {
    return this.http.post<RegisterWithEnrollmentResponse>(
      `${environment.apiUrl}/auth/register-with-enrollment`,
      data,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        console.log('Usuario registrado con matrícula:', response.userId);
      })
    );
  }

  /**
   * Verifica si un usuario existe por correo electrónico
   */
  verificarUsuarioPorEmail(email: string): Observable<boolean> {
    return this.http.get<VerificarUsuarioResponse>(
      `${environment.apiUrl}/usuarios/check-email?email=${encodeURIComponent(email)}`
    ).pipe(
      map(response => response.existe),
      catchError(error => {
        console.error('Error al verificar usuario:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');

    document.cookie = `${this.COOKIE_TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${this.GATEWAY_DOMAIN}`;

    this._currentUser.set(null);

    this.router.navigate(['/login']);
  }

  checkIsAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): AuthResponse['userInfo'] | null {
    return this._currentUser();
  }

  getUserRole(): string | null {
    return this.userRole();
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/refresh`, 
      { refreshToken },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.saveTokenToCookie(response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      })
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch (error) {
      return true;
    }
  }

}