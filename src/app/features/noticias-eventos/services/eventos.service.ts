import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EventoProximo } from '../../../core/models/evento-proximo';

@Injectable({
    providedIn: 'root'
})
export class EventosService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.noticiasEventosUrl}/eventos`;

    getEventosProximos(): Observable<EventoProximo[]> {
        return this.http.get<EventoProximo[]>(`${this.apiUrl}/proximos`);
    }
}
