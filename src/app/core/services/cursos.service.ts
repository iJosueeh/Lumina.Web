import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CourseDetails } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class CursosService {
    private http = inject(HttpClient);
    private apiUrl = environment.coursesUrl;

    /**
     * Obtiene todos los cursos disponibles
     */
    getAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>(this.apiUrl);
    }

    /**
     * Obtiene el detalle completo de un curso por ID
     */
    getCourseById(id: string): Observable<CourseDetails> {
        return this.http.get<CourseDetails>(`${this.apiUrl}/${id}`);
    }

    /**
     * Obtiene los cursos en los que el estudiante está matriculado
     * Nota: Este endpoint debería estar en el microservicio de Estudiantes
     */
    getEnrolledCourses(estudianteId: string): Observable<Course[]> {
        return this.http.get<any[]>(`${environment.estudiantesUrl}/estudiantes/${estudianteId}/matriculas`)
            .pipe(
                map(matriculas => matriculas.map(m => ({
                    id: m.cursoId,
                    // Los demás datos se obtendrían haciendo otra llamada o desde el backend
                    titulo: m.cursoNombre || '',
                    descripcion: '',
                    categoria: '',
                    nivel: '',
                    imagen: ''
                })))
            );
    }

    /**
     * Busca cursos por término
     */
    searchCourses(term: string): Observable<Course[]> {
        return this.getAllCourses().pipe(
            map(courses => courses.filter(c =>
                c.titulo.toLowerCase().includes(term.toLowerCase()) ||
                c.descripcion.toLowerCase().includes(term.toLowerCase())
            ))
        );
    }

    /**
     * Filtra cursos por categoría
     */
    getCoursesByCategory(categoria: string): Observable<Course[]> {
        return this.getAllCourses().pipe(
            map(courses => courses.filter(c => c.categoria === categoria))
        );
    }
}
