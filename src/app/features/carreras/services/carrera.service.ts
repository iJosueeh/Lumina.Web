import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        return this.http.get<Carrera[]>(this.apiUrl);
    }

    getById(id: string): Observable<Carrera> {
        return this.http.get<Carrera>(`${this.apiUrl}/${id}`);
    }
}
