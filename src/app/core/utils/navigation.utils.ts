import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@app/core/auth/services/auth';
import { environment } from '@environments/environment';

export function redirectToDashboard(role?: string): void {
  const authService = inject(Auth);
  const router = inject(Router);
  
  const userRole = (role || authService.getUserRole())?.toUpperCase();
  const portalBase = environment.portalUrl.replace('/login', '');

  switch (userRole) {
    case 'ADMIN':
      window.location.href = `${portalBase}/admin`;
      break;
    case 'TEACHER':
      window.location.href = `${portalBase}/teacher`;
      break;
    case 'STUDENT':
      window.location.href = `${portalBase}/student`;
      break;
    default:
      router.navigate(['/home']);
  }
}

export function redirectToLogin(): void {
  const router = inject(Router);
  router.navigate(['/login']);
}
