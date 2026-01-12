import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface ErrorConfig {
  message?: string;
  duration?: number;
  showNotification?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private snackBar = inject(MatSnackBar);

  /**
   * Maneja errores de forma centralizada
   * @param error El error a manejar
   * @param config Configuración opcional
   * @returns El valor por defecto si se proporciona
   */
  handleError<T>(error: any, config?: ErrorConfig, defaultValue?: T): T | never {
    const message = config?.message || this.getDefaultErrorMessage(error);
    const duration = config?.duration || 5000;
    const showNotification = config?.showNotification !== false;

    console.error('Error capturado:', error);

    if (showNotification) {
      this.showErrorNotification(message, duration);
    }

    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw error;
  }

  /**
   * Muestra una notificación de error
   */
  showErrorNotification(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Muestra una notificación de éxito
   */
  showSuccessNotification(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  showWarningNotification(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['warning-snackbar']
    });
  }

  /**
   * Obtiene un mensaje de error por defecto basado en el tipo de error
   */
  private getDefaultErrorMessage(error: any): string {
    if (error?.status === 0) {
      return 'No se puede conectar con el servidor. Verifica tu conexión.';
    }
    if (error?.status === 404) {
      return 'Recurso no encontrado.';
    }
    if (error?.status === 500) {
      return 'Error interno del servidor.';
    }
    if (error?.status === 503) {
      return 'Servicio temporalmente no disponible.';
    }
    return error?.message || 'Ha ocurrido un error inesperado.';
  }

  /**
   * Maneja errores HTTP de forma silenciosa y retorna un objeto de error para mostrar en la UI
   * @param error El error HTTP capturado
   * @param customMessage Mensaje personalizado opcional
   * @returns Un objeto con información del error para mostrar en la UI
   */
  handleHttpError(error: any, customMessage?: string): { isError: boolean; message: string; statusCode?: number } {
    const message = customMessage || this.getDefaultErrorMessage(error);
    
    console.error('Error HTTP capturado:', error);

    return {
      isError: true,
      message,
      statusCode: error?.status
    };
  }

  /**
   * Obtiene un mensaje de error amigable para mostrar cuando un microservicio no está disponible
   */
  getServiceUnavailableMessage(serviceName?: string): string {
    return serviceName 
      ? `El servicio de ${serviceName} no está disponible en este momento. Por favor, intenta más tarde.`
      : 'El contenido no está disponible en este momento. Por favor, intenta más tarde.';
  }
}
