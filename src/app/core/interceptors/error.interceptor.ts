import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';
      let showSnackbar = true;

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
        console.error('Error del cliente:', error.error.message);
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 0:
            // Sin conexión o servicio no disponible
            errorMessage = 'No se puede conectar con el servidor. Por favor, verifica tu conexión a internet.';
            console.error('Servicio no disponible:', req.url);
            break;
          case 400:
            errorMessage = error.error?.message || 'Solicitud inválida';
            break;
          case 401:
            errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('currentUser');
            router.navigate(['/login'], { queryParams: { sessionExpired: true } });
            break;
          case 403:
            errorMessage = 'No tienes permisos para acceder a este recurso.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            showSnackbar = false; // No mostrar para 404, puede ser normal
            console.warn('Recurso no encontrado:', req.url);
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
            break;
          case 503:
            errorMessage = 'Servicio temporalmente no disponible. Por favor, intenta más tarde.';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
        }

        console.error(`Error HTTP ${error.status}:`, {
          url: req.url,
          message: error.message,
          details: error.error
        });
      }

      // Mostrar notificación al usuario
      if (showSnackbar && error.status !== 401) {
        snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }

      return throwError(() => error);
    })
  );
};
