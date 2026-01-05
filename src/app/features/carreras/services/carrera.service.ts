import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Carrera } from '@app/core/models/carrera';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CarreraService {
    private http = inject(HttpClient);
    // Assuming environment has a base URL, or hardcoding related to the new microservice
    private apiUrl = environment.carrerasUrl;

    getAllCarreras(): Observable<Carrera[]> {
        return this.http.get<Carrera[]>(this.apiUrl).pipe(
            catchError(() => of([]))
        );
    }

    getById(id: string): Observable<Carrera> {
        return this.http.get<Carrera>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => {
                console.error('Error al obtener carrera:', error);
                throw error;
            })
        );
    }
}
