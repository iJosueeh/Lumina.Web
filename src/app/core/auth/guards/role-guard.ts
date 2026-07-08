import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import { environment } from '@environments/environment';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole()?.toUpperCase();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  const currentUserRole = userRole;
  const portalBase = environment.portalUrl.replace('/login', '');

  if (!currentUserRole) {
    router.navigate(['/login']);
  } else {
    switch (currentUserRole) {
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
        router.navigate(['/unauthorized']);
    }
  }

  return false;
};