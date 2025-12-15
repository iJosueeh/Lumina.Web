import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Benefit } from '@app/core/models/benefit';
import { CourseLista } from '@app/core/models/course-lista';
import { FAQ } from '@app/core/models/faq';
import { Testimonial } from '@app/core/models/testimonial';
import { CursoService } from '../cursos/services/curso.service';
import { CursosService } from '@app/core/services/cursos.service';
import { Course } from '@app/core/models/course.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private cursoService = inject(CursoService);
  private cursosService = inject(CursosService);

  selectedFilter = 'Todos';

  filters = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

  allCourses: CourseLista[] = [];
  visibleCourses: CourseLista[] = []; // New property to hold a limited number of courses
  featuredCourses: Course[] = []; // Cursos destacados para la sección de programas

  benefits: Benefit[] = [
    {
      icono: 'instructor',
      titulo: 'Instructores Expertos',
      descripcion: 'Aprende de profesionales con años de experiencia en la industria.'
    },
    {
      icono: 'projects',
      titulo: 'Proyectos Reales',
      descripcion: 'Construye un portafolio sólido trabajando en proyectos del mundo real.'
    },
    {
      icono: 'community',
      titulo: 'Comunidad Activa',
      descripcion: 'Conecta con otros estudiantes y mentores para resolver dudas y colaborar.'
    }
  ];

  testimonials: Testimonial[] = [
    {
      id: 1,
      nombre: 'Ana García',
      cargo: 'Desarrolladora Web',
      empresa: 'Tech Solutions',
      testimonio: 'Los cursos de Lumina.Core me dieron la confianza y las habilidades para cambiar de carrera y conseguir mi primer trabajo como desarrolladora front-end. ¡Totalmente recomendado!',
      avatar: 'https://plus.unsplash.com/premium_photo-1690086519096-0594592709d3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyJTIwZmVtZW5pbm98ZW58MHx8MHx8fDA%3D'
    }
  ];

  faqs: FAQ[] = [
    {
      pregunta: '¿Necesito experiencia previa para tomar los cursos de principiante?',
      respuesta: 'No, nuestros cursos de principiante están diseñados para personas sin experiencia previa. Empezamos desde los fundamentos y avanzamos paso a paso.',
      isOpen: false
    },
    {
      pregunta: '¿Obtendré un certificado al finalizar un curso?',
      respuesta: 'Sí, al completar exitosamente un curso recibirás un certificado digital que puedes compartir en tu LinkedIn y añadir a tu CV.',
      isOpen: false
    },
    {
      pregunta: '¿Tengo acceso de por vida a los cursos que compre?',
      respuesta: 'Sí, una vez que compras un curso tienes acceso ilimitado de por vida, incluyendo todas las actualizaciones futuras del contenido.',
      isOpen: false
    }
  ];

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadCourses();
    this.loadFeaturedCourses();
  }

  loadCourses(): void {
    this.cursoService.getAllCourses().subscribe({
      next: (courses) => {
        this.allCourses = courses;
        this.applyFiltersAndLimit();
      },
      error: (error) => {
        console.error('Error al cargar los cursos:', error);
      }
    });
  }

  loadFeaturedCourses(): void {
    this.cursosService.getFeaturedCourses().subscribe({
      next: (courses) => {
        this.featuredCourses = courses;
      },
      error: (error) => {
        console.error('Error al cargar cursos destacados:', error);
        // Fallback: mostrar array vacío
        this.featuredCourses = [];
      }
    });
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
    this.applyFiltersAndLimit();
  }

  applyFiltersAndLimit(): void {
    let filtered = this.allCourses;

    if (this.selectedFilter !== 'Todos') {
      filtered = filtered.filter(course => course.nivel === this.selectedFilter);
    }
    this.visibleCourses = filtered.slice(0, 6); // Limit to 6 courses for homepage
  }

  get filteredCourses(): CourseLista[] { // Changed to CourseLista
    return this.visibleCourses;
  }

  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }

  getColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'teal': 'bg-teal-600',
      'gray': 'bg-gray-600',
      'blue': 'bg-blue-600',
      'purple': 'bg-purple-600',
      'yellow': 'bg-yellow-500', // Assuming yellow exists in CourseLista
      'green': 'bg-green-600',   // Assuming green exists in CourseLista
      'indigo': 'bg-indigo-600'  // Assuming indigo exists in CourseLista
    };
    return colorMap[color] || 'bg-gray-600'; // Default to gray if color not found
  }
}