import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrearPedidoCommand } from '../models/pedido.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private apiUrl = `${environment.pedidosUrl}/pedidos`;

  // Estados de carga y error
  loading = signal(false);
  error = signal<{ isError: boolean; message: string } | null>(null);

  crearPedido(command: CrearPedidoCommand): Observable<string | null> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.post<string>(this.apiUrl, command).pipe(
      map(response => {
        this.loading.set(false);
        return response;
      }),
      catchError(error => {
        this.loading.set(false);
        const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo crear el pedido');
        this.error.set(errorInfo);
        return of(null);
      })
    );
  }

  /**
   * Limpia el estado de error
   */
  clearError(): void {
    this.error.set(null);
  }
}
