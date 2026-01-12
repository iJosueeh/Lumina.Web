import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
    Evaluacion,
    Pregunta,
    RespuestaEvaluacion,
    ResultadoEvaluacion,
    TipoEvaluacion,
    EstadoEvaluacion
} from '../models/evaluacion.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class EvaluacionesService {
    private http = inject(HttpClient);
    private errorHandler = inject(ErrorHandlerService);
    private apiUrl = `${environment.apiUrl}/evaluaciones`; // Ajustar cuando sepas el puerto

    // Estados de carga y error
    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

    /**
     * Obtiene todas las evaluaciones de un estudiante
     */
    getEvaluacionesByEstudiante(estudianteId: string): Observable<Evaluacion[]> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<Evaluacion[]>(`${this.apiUrl}?estudianteId=${estudianteId}`).pipe(
            map(evaluaciones => {
                this.loading.set(false);
                return evaluaciones;
            }),
            catchError((error) => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las evaluaciones');
                this.error.set(errorInfo);
                console.warn('Endpoint getEvaluacionesByEstudiante no disponible, usando datos mock');
                return of([
                    {
                        id: '1',
                        titulo: 'Examen Parcial de .NET',
                        cursoId: '1',
                        cursoNombre: 'Desarrollo Web con .NET',
                        fechaInicio: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                        fechaFin: new Date(new Date().getTime() + 26 * 60 * 60 * 1000),
                        fechaLimite: new Date(new Date().getTime() + 26 * 60 * 60 * 1000),
                        duracionMinutos: 60,
                        duracion: 60,
                        estado: EstadoEvaluacion.Pendiente,
                        tipo: TipoEvaluacion.Examen,
                        intentos: 0,
                        intentosMaximos: 1
                    },
                    {
                        id: '2',
                        titulo: 'Quiz de Componentes',
                        cursoId: '2',
                        cursoNombre: 'Frontend con Angular',
                        fechaInicio: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
                        fechaFin: new Date(new Date().getTime() + 50 * 60 * 60 * 1000),
                        fechaLimite: new Date(new Date().getTime() + 50 * 60 * 60 * 1000),
                        duracionMinutos: 30,
                        duracion: 30,
                        estado: EstadoEvaluacion.Pendiente,
                        tipo: TipoEvaluacion.Quiz,
                        intentos: 0,
                        intentosMaximos: 3
                    }
                ]);
            })
        );
    }

    /**
     * Obtiene las evaluaciones de un curso específico
     */
    getEvaluacionesByCurso(cursoId: string): Observable<Evaluacion[]> {
        return this.http.get<Evaluacion[]>(`${this.apiUrl}?cursoId=${cursoId}`);
    }

    /**
     * Obtiene el detalle de una evaluación por ID
     */
    getEvaluacionById(id: string): Observable<Evaluacion> {
        return this.http.get<Evaluacion>(`${this.apiUrl}/${id}`);
    }

    /**
     * Obtiene las preguntas de una evaluación
     */
    getPreguntasEvaluacion(evaluacionId: string): Observable<Pregunta[]> {
        return this.http.get<Pregunta[]>(`${this.apiUrl}/${evaluacionId}/preguntas`);
    }

    /**
     * Envía las respuestas de una evaluación
     */
    submitEvaluacion(
        evaluacionId: string,
        respuestas: RespuestaEvaluacion[]
    ): Observable<ResultadoEvaluacion> {
        return this.http.post<ResultadoEvaluacion>(
            `${this.apiUrl}/${evaluacionId}/respuestas`,
            { respuestas }
        );
    }

    /**
     * Guarda el progreso de una evaluación (autoguardado)
     */
    guardarProgreso(
        evaluacionId: string,
        respuestas: RespuestaEvaluacion[]
    ): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/${evaluacionId}/progreso`,
            { respuestas }
        );
    }

    /**
     * Obtiene el resultado de una evaluación completada
     */
    getResultado(evaluacionId: string, estudianteId: string): Observable<ResultadoEvaluacion> {
        return this.http.get<ResultadoEvaluacion>(
            `${this.apiUrl}/${evaluacionId}/resultado?estudianteId=${estudianteId}`
        );
    }
}
