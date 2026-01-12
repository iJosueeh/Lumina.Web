import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EventoProximo } from '../../../core/models/evento-proximo';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class EventosService {
    private http = inject(HttpClient);
    private errorHandler = inject(ErrorHandlerService);
    private apiUrl = `${environment.noticiasEventosUrl}/eventos`;

    // Estados de carga y error
    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

    getEventosProximos(): Observable<EventoProximo[]> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<EventoProximo[]>(`${this.apiUrl}/proximos`).pipe(
            map(eventos => {
                this.loading.set(false);
                return eventos;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar los eventos próximos');
                this.error.set(errorInfo);
                return of([]);
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
