import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  const currentUserRole = userRole;

  if (!currentUserRole) {
    router.navigate(['/login']);
  } else {
    switch (currentUserRole) {
      case 'ADMIN':
        router.navigate(['/admin/dashboard']);
        break;
      case 'PROFESIONAL':
        router.navigate(['/profesional/dashboard']);
        break;
      case 'ESTUDIANTE':
        router.navigate(['/estudiante/dashboard']);
        break;
      default:
        router.navigate(['/unauthorized']);
    }
  }

  return false;
};