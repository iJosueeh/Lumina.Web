import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
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

    /**
     * Obtiene todos los cursos disponibles
     */
    getAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(this.apiUrl).pipe(
            catchError(error => {
                this.errorHandler.handleError(error, {
                    message: 'No se pudieron cargar los cursos. Por favor, intenta más tarde.',
                    showNotification: false // El interceptor ya muestra notificación
                }, []);
                return of([]); // Retorna array vacío en caso de error
            })
        );
    }

    /**
     * Obtiene el detalle completo de un curso por ID
     */
    getCourseById(id: string): Observable<CourseDetails | null> {
        return this.http.get<CourseDetails>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => {
                this.errorHandler.handleError(error, {
                    message: 'No se pudo cargar el curso.',
                    showNotification: false
                }, null);
                return of(null);
            })
        );
    }

    /**
     * Obtiene las categorías de cursos
     */
    getCategorias(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/categorias`).pipe(
            catchError(error => {
                console.error('Error al cargar categorías:', error);
                // Retornar categorías por defecto si falla
                return of(['Programación', 'Diseño', 'Marketing', 'Data Science', 'Negocios']);
            })
        );
    }

    /**
     * Busca cursos por término
     */
    searchCourses(term: string): Observable<Course[]> {
        return this.http.get<Course[]>(`${this.apiUrl}/search`, {
            params: { q: term }
        }).pipe(
            catchError(error => {
                this.errorHandler.handleError(error, {
                    message: 'Error al buscar cursos.',
                    showNotification: false
                }, []);
                return of([]);
            })
        );
    }

    /**
     * Filtra cursos por categoría
     */
    getCoursesByCategory(categoria: string): Observable<Course[]> {
        return this.http.get<Course[]>(`${this.apiUrl}/categoria/${categoria}`).pipe(
            catchError(error => {
                this.errorHandler.handleError(error, {
                    message: `Error al cargar cursos de ${categoria}.`,
                    showNotification: false
                }, []);
                return of([]);
            })
        );
    }
}
