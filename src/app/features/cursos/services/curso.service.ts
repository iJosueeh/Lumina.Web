import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { CourseLista } from '@app/core/models/course-lista';
import { CourseDetalles } from '@app/core/models/course-detalles';
import { ErrorHandlerService } from '@app/core/services/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private apiUrl = environment.coursesUrl;

  // Estados de carga y error
  loading = signal(false);
  error = signal<{ isError: boolean; message: string } | null>(null);

  getAllCourses(): Observable<CourseLista[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<CourseLista[]>(this.apiUrl).pipe(
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

  getCourseById(id: string): Observable<CourseDetalles | null> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<CourseDetalles>(`${this.apiUrl}/${id}`).pipe(
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

  getCategorias(): Observable<string[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<string[]>(`${this.apiUrl}/categorias`).pipe(
      map(categorias => {
        this.loading.set(false);
        return categorias;
      }),
      catchError(error => {
        this.loading.set(false);
        const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las categorías');
        this.error.set(errorInfo);
        return of([]);
      })
    );
  }

  getNiveles(): Observable<string[]> {
    this.loading.set(true);
    this.error.set(null);
    
    return this.http.get<string[]>(`${this.apiUrl}/niveles`).pipe(
      map(niveles => {
        this.loading.set(false);
        return niveles;
      }),
      catchError(error => {
        this.loading.set(false);
        const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar los niveles');
        this.error.set(errorInfo);
        return of([]);
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