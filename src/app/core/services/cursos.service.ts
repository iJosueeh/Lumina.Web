import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CourseDetails } from '../models/course.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class CursosService {
    private http = inject(HttpClient);
    private errorHandler = inject(ErrorHandlerService);
    private apiUrl = environment.coursesUrl;

    // Estados de carga y error
    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

    /**
     * Obtiene todos los cursos disponibles
     */
    getAllCourses(): Observable<Course[]> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<Course[]>(this.apiUrl).pipe(
            map(courses => {
                this.loading.set(false);
                return courses;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar los cursos');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

    /**
     * Obtiene los cursos destacados (primeros 3)
     */
    getFeaturedCourses(): Observable<Course[]> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.getAllCourses().pipe(
            map(courses => {
                this.loading.set(false);
                return courses.slice(0, 3);
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar los cursos destacados');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

    /**
     * Obtiene el detalle completo de un curso por ID
     */
    getCourseById(id: string): Observable<CourseDetails | null> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<CourseDetails>(`${this.apiUrl}/${id}`).pipe(
            map(course => {
                this.loading.set(false);
                return course;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar el detalle del curso');
                this.error.set(errorInfo);
                return of(null);
            })
        );
    }

    /**
     * Obtiene los cursos en los que el estudiante está matriculado
     * Nota: Este endpoint debería estar en el microservicio de Estudiantes
     */
    getEnrolledCourses(estudianteId: string): Observable<Course[]> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<any[]>(`${environment.estudiantesUrl}/estudiantes/${estudianteId}/matriculas`)
            .pipe(
                map(matriculas => {
                    this.loading.set(false);
                    return matriculas.map(m => ({
                        id: m.cursoId,
                        titulo: m.cursoNombre || '',
                        descripcion: '',
                        categoria: '',
                        nivel: '',
                        imagen: ''
                    }));
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
     * Busca cursos por término
     */
    searchCourses(term: string): Observable<Course[]> {
        return this.getAllCourses().pipe(
            map(courses => courses.filter(c =>
                c.titulo.toLowerCase().includes(term.toLowerCase()) ||
                c.descripcion.toLowerCase().includes(term.toLowerCase())
            ))
        );
    }

    /**
     * Filtra cursos por categoría
     */
    getCoursesByCategory(categoria: string): Observable<Course[]> {
        return this.getAllCourses().pipe(
            map(courses => courses.filter(c => c.categoria === categoria))
        );
    }

    /**
     * Limpia el estado de error
     */
    clearError(): void {
        this.error.set(null);
    }
}
