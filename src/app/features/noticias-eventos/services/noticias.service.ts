import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Noticia } from '../../../core/models/noticia';

@Injectable({
    providedIn: 'root'
})
export class NoticiasService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.noticiasEventosUrl}/noticias`;

    getNoticias(params?: {
        page?: number;
        pageSize?: number;
        categoria?: string;
        search?: string;
    }): Observable<Noticia[]> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.page) httpParams = httpParams.set('page', params.page);
            if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
            if (params.categoria && params.categoria !== 'todos') httpParams = httpParams.set('categoria', params.categoria);
            if (params.search) httpParams = httpParams.set('search', params.search);
        }

        return this.http.get<Noticia[]>(this.apiUrl, { params: httpParams });
    }

    getNoticiaById(id: string): Observable<Noticia> {
        return this.http.get<Noticia>(`${this.apiUrl}/${id}`);
    }

    getCategorias(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/categorias`);
    }
}
