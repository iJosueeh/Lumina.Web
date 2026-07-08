import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Programacion, CalendarioEvento } from '../models/programacion.model';

@Injectable({
    providedIn: 'root'
})
export class ProgramacionesService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.estudiantesUrl}/programaciones`;

    /**
     * Obtiene todas las programaciones de un estudiante
     */
    getProgramacionesByEstudiante(estudianteId: string): Observable<Programacion[]> {
        return this.http.get<Programacion[]>(`${this.apiUrl}?estudianteId=${estudianteId}`);
    }

    /**
     * Obtiene las programaciones de un curso específico
     */
    getProgramacionesByCurso(cursoId: string): Observable<Programacion[]> {
        return this.http.get<Programacion[]>(`${this.apiUrl}?cursoId=${cursoId}`);
    }

    /**
     * Obtiene las próximas clases (próximos 7 días)
     */
    getProximasClases(estudianteId: string, dias: number = 7): Observable<Programacion[]> {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + dias);

        return this.http.get<Programacion[]>(
            `${this.apiUrl}?estudianteId=${estudianteId}&hasta=${fechaLimite.toISOString()}`
        ).pipe(
            catchError(() => {
                return of([]);
            })
        );
    }

    /**
     * Obtiene todos los eventos del calendario (clases, evaluaciones, entregas)
     */
    getEventosCalendario(
        estudianteId: string,
        fechaInicio: Date,
        fechaFin: Date
    ): Observable<CalendarioEvento[]> {
        return this.http.get<CalendarioEvento[]>(
            `${this.apiUrl}/calendario?estudianteId=${estudianteId}&inicio=${fechaInicio.toISOString()}&fin=${fechaFin.toISOString()}`
        );
    }

    /**
     * Obtiene el horario semanal del estudiante
     */
    getHorarioSemanal(estudianteId: string): Observable<Programacion[]> {
        const hoy = new Date();
        const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        return this.http.get<Programacion[]>(
            `${this.apiUrl}?estudianteId=${estudianteId}&inicio=${inicioSemana.toISOString()}&fin=${finSemana.toISOString()}`
        );
    }
}
