import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface Carrito {
  estudianteId: string;
  cursoIds: string[];
}

export interface Result<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error: any;
  value: T;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.estudiantesUrl}/carritos`;

  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  agregarCurso(estudianteId: string, cursoId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${estudianteId}/items`, { cursoId });
  }

  eliminarCurso(estudianteId: string, cursoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${estudianteId}/items/${cursoId}`);
  }

  verCarrito(estudianteId: string): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.apiUrl}/${estudianteId}`).pipe(
      catchError(() => of({ estudianteId: estudianteId, cursoIds: [] } as Carrito))
    );
  }

  vaciarCarrito(estudianteId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${estudianteId}/items`);
  }

  updateCartItemCount(count: number) {
    this.cartItemCount.next(count);
  }
}

