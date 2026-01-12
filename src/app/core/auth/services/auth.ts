import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '@app/core/models/auth-response';
import { LoginRequest } from '@app/core/models/login-request';
import { RegisterRequest, RegisterWithEnrollmentResponse } from '@app/core/models/register-request';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<AuthResponse['userInfo'] | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al parsear usuario del localStorage', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);

          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }

          localStorage.setItem('currentUser', JSON.stringify(response.userInfo));
          this.currentUserSubject.next(response.userInfo);

          if (credentials.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
        })
      );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);

          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }

          localStorage.setItem('currentUser', JSON.stringify(response.userInfo));
          this.currentUserSubject.next(response.userInfo);
        })
      );
  }

  /**
   * Registra un nuevo usuario y opcionalmente lo matricula en una carrera
   */
  registerWithEnrollment(data: RegisterRequest): Observable<RegisterWithEnrollmentResponse> {
    return this.http.post<RegisterWithEnrollmentResponse>(
      `${environment.apiUrl}/auth/register-with-enrollment`,
      data
    ).pipe(
      tap(response => {
        // No guardamos token aquí, el usuario debe confirmar email primero
        console.log('Usuario registrado:', response.userId);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');

    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
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
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.rolPrincipal : null;
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
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