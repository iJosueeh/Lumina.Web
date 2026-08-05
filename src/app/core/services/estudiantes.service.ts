import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
    EstudianteInfo,
    Matricula,
    Progreso,
    DashboardStats
} from '../models/estudiante.model';
import { EnrolledCourse } from '../models/course.model';
import { ErrorHandlerService } from './error-handler.service';
import { Auth } from '../auth/services/auth';

@Injectable({
    providedIn: 'root'
})
export class EstudiantesService {
    private http = inject(HttpClient);
    private errorHandler = inject(ErrorHandlerService);
    private auth = inject(Auth);
    // estudiantesUrl ya incluye /estudiantes/api (localhost) o /api/estudiantes (vercel)
    // Los endpoints del controller son relativos a /api/estudiantes
    private apiUrl = environment.estudiantesUrl;

    /**
     * Inscribe al estudiante autenticado en un curso.
     * Flujo: obtener estudianteId por usuarioId → crear estudiante si no existe → POST /{id}/inscripciones
     * Retorna error con status 409 si ya está inscrito.
     */
    enrollInCourse(cursoId: string): Observable<{ enrolled: boolean; alreadyEnrolled: boolean; message: string } | null> {
        const user = this.auth.currentUser();
        if (!user?.id) {
            return of(null);
        }

        return this.getOrCreateEstudianteId(user.id).pipe(
            switchMap(estudianteId => {
                if (!estudianteId) {
                    return of({ enrolled: false, alreadyEnrolled: false, message: 'No se encontró tu perfil de estudiante. Contácta soporte.' });
                }
                // POST /api/estudiantes/inscripciones { estudianteId, cursoId }
                return this.http.post<{ id: string }>(
                    this.apiUrl,
                    { estudianteId, cursoId }
                ).pipe(
                    map(() => ({ enrolled: true, alreadyEnrolled: false, message: 'Inscripción completada' })),
                    catchError((err: HttpErrorResponse) => {
                        if (err.status === 409) {
                            return of({ enrolled: false, alreadyEnrolled: true, message: 'Ya estás inscrito en este curso' });
                        }
                        // Otros errores (404, 400, 500) → devolver error capturable
                        return of({ enrolled: false, alreadyEnrolled: false, message: 'No se pudo completar la inscripción. Intenta nuevamente.' });
                    })
                );
            })
        );
    }

    /**
     * Obtiene el estudianteId para un usuario. Si no existe, lo crea.
     */
    private getOrCreateEstudianteId(usuarioId: string): Observable<string | null> {
        return this.http.get<{ id: string }>(
            `${this.apiUrl}/by-usuario/${usuarioId}`
        ).pipe(
            map(e => e.id),
            catchError((err: HttpErrorResponse) => {
                if (err.status === 404) {
                    // Estudiante no existe → intentar crearlo
                    // Silencioso: si falla, regresamos null y el enrollment fallará limpiamente
                    return this.http.post<{ id: string }>(
                        this.apiUrl,
                        { usuarioId }
                    ).pipe(
                        map(created => created.id),
                        catchError(() => of(null))
                    );
                }
                return of(null);
            })
        );
    }

    // Estados de carga y error
    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

    /**
     * Obtiene la información del estudiante actual
     */
    getEstudianteInfo(id: string): Observable<EstudianteInfo | null> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.get<EstudianteInfo>(`${this.apiUrl}/${id}`).pipe(
            map(info => {
                this.loading.set(false);
                return info;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar la información del estudiante');
                this.error.set(errorInfo);
                return of(null);
            })
        );
    }

    /**
     * Obtiene todas las matrículas del estudiante
     */
    getMatriculas(estudianteId: string): Observable<Matricula[]> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.get<Matricula[]>(`${this.apiUrl}/${estudianteId}/matriculas`).pipe(
            map(matriculas => {
                this.loading.set(false);
                return matriculas;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las matrículas');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

    /**
     * Obtiene el progreso del estudiante en un curso específico
     */
    getProgreso(estudianteId: string, cursoId: string): Observable<Progreso | null> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.get<Progreso>(
            `${this.apiUrl}/${estudianteId}/progreso/${cursoId}`
        ).pipe(
            map(progreso => {
                this.loading.set(false);
                return progreso;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar el progreso del curso');
                this.error.set(errorInfo);
                return of(null);
            })
        );
    }

    /**
     * Obtiene los cursos matriculados con información completa
     */
    getCursosMatriculados(estudianteId: string): Observable<EnrolledCourse[]> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.get<any[]>(`${this.apiUrl}/${estudianteId}/cursos-matriculados`).pipe(
            map(cursos => {
                this.loading.set(false);
                return cursos;
            }),
            catchError((error) => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar los cursos matriculados');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

    getDashboardStats(estudianteId: string): Observable<DashboardStats> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.get<DashboardStats>(
            `${this.apiUrl}/${estudianteId}/dashboard-stats`
        ).pipe(
            map(stats => {
                this.loading.set(false);
                return stats;
            }),
            catchError((error) => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las estadísticas');
                this.error.set(errorInfo);
                return of({
                    cursosActivos: 0,
                    evaluacionesPendientes: 0,
                    promedioGeneral: 0,
                    horasEstudio: 0,
                    cursosCompletados: 0,
                    horasEstudioSemana: 0
                });
            })
        );
    }

    /**
     * Marca una lección como completada
     */
    marcarLeccionCompletada(
        estudianteId: string,
        cursoId: string,
        leccionId: string
    ): Observable<void | null> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.post<void>(
            `${this.apiUrl}/${estudianteId}/cursos/${cursoId}/lecciones/${leccionId}/completar`,
            {}
        ).pipe(
            map(response => {
                this.loading.set(false);
                return response;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo marcar la lección como completada');
                this.error.set(errorInfo);
                return of(null);
            })
        );
    }

    /**
     * Obtiene el historial académico completo
     */
    getHistorialAcademico(estudianteId: string): Observable<any> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.get(`${this.apiUrl}/${estudianteId}/historial`).pipe(
            map(historial => {
                this.loading.set(false);
                return historial;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar el historial académico');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

    /**
     * Actualiza el perfil del estudiante
     */
    actualizarPerfil(estudianteId: string, data: Partial<EstudianteInfo>): Observable<EstudianteInfo | null> {
        this.loading.set(true);
        this.error.set(null);

        return this.http.put<EstudianteInfo>(
            `${this.apiUrl}/${estudianteId}`,
            data
        ).pipe(
            map(perfil => {
                this.loading.set(false);
                return perfil;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo actualizar el perfil');
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
