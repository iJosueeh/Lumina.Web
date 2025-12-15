import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { CourseLista } from '@app/core/models/course-lista';
import { CourseDetalles } from '@app/core/models/course-detalles';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private http = inject(HttpClient);
  private apiUrl = environment.coursesUrl;

  getAllCourses(): Observable<CourseLista[]> {
    return this.http.get<CourseLista[]>(this.apiUrl);
  }

  getCourseById(id: string): Observable<CourseDetalles> {
    return this.http.get<CourseDetalles>(`${this.apiUrl}/${id}`);
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categorias`);
  }

  getNiveles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/niveles`);
  }
}