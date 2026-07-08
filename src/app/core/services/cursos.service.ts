import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, finalize, tap } from 'rxjs';
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
    private activeRequests = 0;
    private coursesCache = signal<Course[] | null>(null);

    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

    readonly categorias = computed(() => {
        const courses = this.coursesCache();
        if (!courses) return [];
        const set = new Set<string>();
        courses.forEach(c => { if (c.categoria) set.add(c.categoria); });
        return Array.from(set).sort();
    });

    private trackRequest<T>(source$: Observable<T>): Observable<T> {
        this.activeRequests++;
        if (this.activeRequests === 1) {
            this.loading.set(true);
            this.error.set(null);
        }

        return source$.pipe(
            finalize(() => {
                this.activeRequests--;
                if (this.activeRequests === 0) {
                    this.loading.set(false);
                }
            })
        );
    }

    getAllCourses(forceRefresh = false): Observable<Course[]> {
        if (this.coursesCache() && !forceRefresh) {
            return of(this.coursesCache()!);
        }
        return this.trackRequest(
            this.http.get<Course[]>(this.apiUrl).pipe(
                tap(courses => this.coursesCache.set(courses)),
                catchError(error => {
                    const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar los cursos');
                    this.error.set(errorInfo);
                    return of([]);
                })
            )
        );
    }

    getCourseById(id: string): Observable<CourseDetails | null> {
        return this.trackRequest(
            this.http.get<CourseDetails>(`${this.apiUrl}/${id}`).pipe(
                catchError(error => {
                    const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar el detalle del curso');
                    this.error.set(errorInfo);
                    return of(null);
                })
            )
        );
    }

    clearError(): void {
        this.error.set(null);
    }
}
