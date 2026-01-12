import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Noticia } from '../../../core/models/noticia';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class NoticiasService {
    private http = inject(HttpClient);
    private errorHandler = inject(ErrorHandlerService);
    private apiUrl = `${environment.noticiasEventosUrl}/noticias`;

    // Estados de carga y error
    loading = signal(false);
    error = signal<{ isError: boolean; message: string } | null>(null);

    getNoticias(params?: {
        page?: number;
        pageSize?: number;
        categoria?: string;
        search?: string;
    }): Observable<Noticia[]> {
        this.loading.set(true);
        this.error.set(null);
        
        let httpParams = new HttpParams();
        if (params) {
            if (params.page) httpParams = httpParams.set('page', params.page);
            if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
            if (params.categoria && params.categoria !== 'todos') httpParams = httpParams.set('categoria', params.categoria);
            if (params.search) httpParams = httpParams.set('search', params.search);
        }

        return this.http.get<Noticia[]>(this.apiUrl, { params: httpParams }).pipe(
            map(noticias => {
                this.loading.set(false);
                return noticias;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudieron cargar las noticias');
                this.error.set(errorInfo);
                return of([]);
            })
        );
    }

    getNoticiaById(id: string): Observable<Noticia | null> {
        this.loading.set(true);
        this.error.set(null);
        
        return this.http.get<Noticia>(`${this.apiUrl}/${id}`).pipe(
            map(noticia => {
                this.loading.set(false);
                return noticia;
            }),
            catchError(error => {
                this.loading.set(false);
                const errorInfo = this.errorHandler.handleHttpError(error, 'No se pudo cargar la noticia');
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
                return of(['Académicas', 'Deportes', 'Cultura', 'Tecnología']);
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
