import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Carrera } from '@app/core/models/carrera';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '@app/core/services/error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class CarreraService {
    private http = inject(HttpClient);
    private errorHandler = inject(ErrorHandlerService);
    private apiUrl = environment.carrerasUrl;

    // Estados de carga y error
    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

    getAllCarreras(): Observable<Carrera[]> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<Carrera[]>(this.apiUrl).pipe(
            map(carreras => {
                this.loading.set(false);
                return carreras;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las carreras');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

    getById(id: string): Observable<Carrera | null> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<Carrera>(`${this.apiUrl}/${id}`).pipe(
            map(carrera => {
                this.loading.set(false);
                return carrera;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar la carrera');
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
