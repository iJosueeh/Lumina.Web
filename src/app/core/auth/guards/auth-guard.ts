import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import { environment } from '@environments/environment';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Auth);

  if (authService.isAuthenticated()) {
    return true;
  }

  window.location.href = environment.portalUrl;
  return false;
};