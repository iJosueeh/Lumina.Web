import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    private apiUrl = environment.estudiantesUrl;

    /**
     * Verifica si el usuario aun existe en UsuariosDb.
     * Si fue eliminado, hace logout automatico.
     */
    private verificarUsuarioExiste(usuarioId: string): Observable<boolean> {
        return this.http.get<{ id: string }>(
            `${environment.apiUrl}/usuarios/${usuarioId}`
        ).pipe(
            map(() => true),
            catchError((err: HttpErrorResponse) => {
                if (err.status === 404) {
                    console.warn('[enrollInCourse] Usuario eliminado de UsuariosDb - haciendo logout');
                    this.auth.logout();
                }
                return of(false);
            })
        );
    }

    /**
     * Flujo: verificar usuario existe -> obtener estudianteId -> crear si no existe -> POST /inscripciones
     */
    enrollInCourse(cursoId: string): Observable<{ enrolled: boolean; alreadyEnrolled: boolean; message: string } | null> {
        const user = this.auth.currentUser();
        if (!user?.id) {
            return of(null);
        }

        return this.verificarUsuarioExiste(user.id).pipe(
            switchMap(existe => {
                if (!existe) {
                    return of({ enrolled: false, alreadyEnrolled: false, message: 'Tu cuenta ya no existe. Por favor registrate nuevamente.' });
                }
                return this.getOrCreateEstudianteId(user.id).pipe(
                    switchMap(estudianteId => {
                        if (!estudianteId) {
                            return of({ enrolled: false, alreadyEnrolled: false, message: 'No se encontro tu perfil de estudiante. Contacta soporte.' });
                        }
                        return this.verificarInscripcion(estudianteId, cursoId).pipe(
                            switchMap(yaInscrito => {
                                if (yaInscrito) {
                                    return of({ enrolled: false, alreadyEnrolled: true, message: 'Ya estas inscrito en este curso.' });
                                }
                                return this.http.post<{ id: string }>(
                                    `${this.apiUrl}/inscripciones`,
                                    { estudianteId, cursoId }
                                ).pipe(
                                    map(() => ({ enrolled: true, alreadyEnrolled: false, message: 'Inscripcion completada' })),
                                    catchError((err: HttpErrorResponse) => {
                                        if (err.status === 409) {
                                            return of({ enrolled: false, alreadyEnrolled: true, message: 'Ya estas inscrito en este curso' });
                                        }
                                        return of({ enrolled: false, alreadyEnrolled: false, message: 'No se pudo completar la inscripcion. Intenta nuevamente.' });
                                    })
                                );
                            })
                        );
                    })
                );
            })
        );
    }

    /**
     * Verifica si el estudiante ya esta inscrito en un curso.
     */
    verificarInscripcion(estudianteId: string, cursoId: string): Observable<boolean> {
        return this.http.get<{ inscrito: boolean }>(
            `${this.apiUrl}/inscripciones/verificar`,
            { params: { estudianteId, cursoId } }
        ).pipe(
            map(r => r.inscrito),
            catchError(() => of(false))
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

    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

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
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar la informacion del estudiante');
                this.error.set(errorInfo);
                return of(null);
            })
        );
    }

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
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las matriculas');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

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
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las estadisticas');
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
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo marcar la leccion como completada');
                this.error.set(errorInfo);
                return of(null);
            })
        );
    }

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
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar el historial academico');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

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

    clearError(): void {
        this.error.set(null);
    }
}
