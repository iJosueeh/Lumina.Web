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
                console.warn('Endpoint getProximasClases no disponible, usando datos mock');
                return of([
                    {
                        id: '1',
                        titulo: 'Clase de .NET Core',
                        descripcion: 'Introducción a Web API',
                        fechaInicio: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Mañana
                        fechaFin: new Date(new Date().getTime() + 26 * 60 * 60 * 1000),
                        cursoId: '1',
                        cursoNombre: 'Desarrollo Web con .NET',
                        tipo: 'CLASE_VIRTUAL',
                        enlaceReunion: 'https://meet.google.com/abc-defg-hij',
                        docenteId: 'd1',
                        docenteNombre: 'Juan Pérez',
                        modalidad: 'Virtual' as 'Virtual'
                    },
                    {
                        id: '2',
                        titulo: 'Taller de Angular',
                        descripcion: 'Componentes y Servicios',
                        fechaInicio: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // Pasado mañana
                        fechaFin: new Date(new Date().getTime() + 50 * 60 * 60 * 1000),
                        cursoId: '2',
                        cursoNombre: 'Frontend con Angular',
                        tipo: 'TALLER',
                        aula: 'Laboratorio 3',
                        docenteId: 'd2',
                        docenteNombre: 'Ana García',
                        modalidad: 'Presencial' as 'Presencial'
                    }
                ]);
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
