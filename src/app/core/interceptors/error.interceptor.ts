import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Sistema de debouncing para evitar múltiples notificaciones
let errorQueue: Set<string> = new Set();
let isShowingError = false;
let errorTimeout: any = null;

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

      // Sistema de cola de errores para evitar abrumar al usuario
      if (showSnackbar && error.status !== 401) {
        const errorKey = `${error.status}-${req.url}`;
        
        // Solo agregar a la cola si no está ya procesándose
        if (!errorQueue.has(errorKey)) {
          errorQueue.add(errorKey);
          
          // Procesar la cola de errores de forma secuencial
          const showNextError = () => {
            if (errorQueue.size > 0 && !isShowingError) {
              isShowingError = true;
              
              // Agrupar errores similares
              const uniqueMessages = new Set<string>();
              errorQueue.forEach(key => {
                if (key.startsWith(error.status.toString())) {
                  uniqueMessages.add(errorMessage);
                }
              });
              
              // Mostrar solo un mensaje si hay múltiples errores del mismo tipo
              const finalMessage = errorQueue.size > 3 
                ? 'Algunos servicios no están disponibles. Por favor, intenta más tarde.'
                : errorMessage;
              
              snackBar.open(finalMessage, 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              });
              
              // Limpiar la cola después de mostrar
              setTimeout(() => {
                errorQueue.clear();
                isShowingError = false;
              }, 3500);
            }
          };
          
          // Debounce: esperar 500ms antes de mostrar el error
          clearTimeout(errorTimeout);
          errorTimeout = setTimeout(showNextError, 500);
        }
      }

      return throwError(() => error);
    })
  );
};
