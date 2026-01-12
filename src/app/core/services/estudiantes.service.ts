import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
    EstudianteInfo,
    Matricula,
    Progreso,
    DashboardStats
} from '../models/estudiante.model';
import { EnrolledCourse } from '../models/course.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class EstudiantesService {
    private http = inject(HttpClient);
    private errorHandler = inject(ErrorHandlerService);
    private apiUrl = environment.estudiantesUrl;

    // Estados de carga y error
    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

    /**
     * Obtiene la información del estudiante actual
     */
    getEstudianteInfo(id: string): Observable<EstudianteInfo | null> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<EstudianteInfo>(`${this.apiUrl}/estudiantes/${id}`).pipe(
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
        
        return this.http.get<Matricula[]>(`${this.apiUrl}/estudiantes/${estudianteId}/matriculas`).pipe(
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
            `${this.apiUrl}/estudiantes/${estudianteId}/progreso/${cursoId}`
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
        
        return this.http.get<any[]>(`${this.apiUrl}/estudiantes/${estudianteId}/cursos-matriculados`).pipe(
            map(cursos => {
                this.loading.set(false);
                return cursos;
            }),
            catchError((error) => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar los cursos matriculados');
                this.error.set(errorInfo);
                console.warn('Endpoint getCursosMatriculados no disponible, usando datos mock');
                return of([
                    {
                        id: '1',
                        titulo: 'Introducción a .NET 8',
                        imagenUrl: 'assets/images/courses/dotnet.jpg',
                        progreso: 75,
                        ultimaActividad: new Date(),
                        instructor: 'Juan Pérez',
                        totalLecciones: 20,
                        leccionesCompletadas: 15,
                        descripcion: 'Curso introductorio a .NET 8',
                        categoria: 'Desarrollo Backend',
                        nivel: 'Principiante',
                        imagen: 'assets/images/courses/dotnet.jpg'
                    },
                    {
                        id: '2',
                        titulo: 'Angular Avanzado',
                        imagenUrl: 'assets/images/courses/angular.jpg',
                        progreso: 30,
                        ultimaActividad: new Date(),
                        instructor: 'Ana García',
                        totalLecciones: 25,
                        leccionesCompletadas: 8,
                        descripcion: 'Curso avanzado de Angular',
                        categoria: 'Desarrollo Frontend',
                        nivel: 'Avanzado',
                        imagen: 'assets/images/courses/angular.jpg'
                    },
                    {
                        id: '3',
                        titulo: 'SQL Server para Desarrolladores',
                        imagenUrl: 'assets/images/courses/sql.jpg',
                        progreso: 0,
                        ultimaActividad: new Date(),
                        instructor: 'Carlos López',
                        totalLecciones: 15,
                        leccionesCompletadas: 0,
                        descripcion: 'Optimización y diseño de bases de datos',
                        categoria: 'Base de Datos',
                        nivel: 'Intermedio',
                        imagen: 'assets/images/courses/sql.jpg'
                    }
                ]);
            })
        );
    }

    /**
     * Obtiene las estadísticas del dashboard
     */
    getDashboardStats(estudianteId: string): Observable<DashboardStats> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<DashboardStats>(
            `${this.apiUrl}/estudiantes/${estudianteId}/dashboard-stats`
        ).pipe(
            map(stats => {
                this.loading.set(false);
                return stats;
            }),
            catchError((error) => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las estadísticas');
                this.error.set(errorInfo);
                console.warn('Endpoint getDashboardStats no disponible, usando datos mock');
                return of({
                    cursosActivos: 3,
                    evaluacionesPendientes: 2,
                    promedioGeneral: 8.5,
                    horasEstudio: 120,
                    cursosCompletados: 1,
                    horasEstudioSemana: 10
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
            `${this.apiUrl}/estudiantes/${estudianteId}/cursos/${cursoId}/lecciones/${leccionId}/completar`,
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
        
        return this.http.get(`${this.apiUrl}/estudiantes/${estudianteId}/historial`).pipe(
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
            `${this.apiUrl}/estudiantes/${estudianteId}`,
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
