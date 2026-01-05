import { Injectable, inject } from '@angular/core';
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

@Injectable({
    providedIn: 'root'
})
export class EstudiantesService {
    private http = inject(HttpClient);
    private apiUrl = environment.estudiantesUrl;

    /**
     * Obtiene la información del estudiante actual
     */
    getEstudianteInfo(id: string): Observable<EstudianteInfo> {
        return this.http.get<EstudianteInfo>(`${this.apiUrl}/estudiantes/${id}`);
    }

    /**
     * Obtiene todas las matrículas del estudiante
     */
    getMatriculas(estudianteId: string): Observable<Matricula[]> {
        return this.http.get<Matricula[]>(`${this.apiUrl}/estudiantes/${estudianteId}/matriculas`);
    }

    /**
     * Obtiene el progreso del estudiante en un curso específico
     */
    getProgreso(estudianteId: string, cursoId: string): Observable<Progreso> {
        return this.http.get<Progreso>(
            `${this.apiUrl}/estudiantes/${estudianteId}/progreso/${cursoId}`
        );
    }

    /**
     * Obtiene los cursos matriculados con información completa
     */
    getCursosMatriculados(estudianteId: string): Observable<EnrolledCourse[]> {
        return this.http.get<any[]>(`${this.apiUrl}/estudiantes/${estudianteId}/cursos-matriculados`).pipe(
            catchError(() => {
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
        return this.http.get<DashboardStats>(
            `${this.apiUrl}/estudiantes/${estudianteId}/dashboard-stats`
        ).pipe(
            catchError(() => {
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
    ): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/estudiantes/${estudianteId}/cursos/${cursoId}/lecciones/${leccionId}/completar`,
            {}
        );
    }

    /**
     * Obtiene el historial académico completo
     */
    getHistorialAcademico(estudianteId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/estudiantes/${estudianteId}/historial`).pipe(
            catchError(() => of([]))
        );
    }

    /**
     * Actualiza el perfil del estudiante
     */
    actualizarPerfil(estudianteId: string, data: Partial<EstudianteInfo>): Observable<EstudianteInfo> {
        return this.http.put<EstudianteInfo>(
            `${this.apiUrl}/estudiantes/${estudianteId}`,
            data
        ).pipe(
            catchError(error => {
                console.error('Error al actualizar perfil:', error);
                throw error;
            })
        );
    }
}
