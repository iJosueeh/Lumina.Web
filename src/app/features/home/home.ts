import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Benefit } from '@app/core/models/benefit';
import { Course } from '@app/core/models/course';
import { FAQ } from '@app/core/models/faq';
import { Testimonial } from '@app/core/models/testimonial';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  selectedFilter = 'Todos';

  filters = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

  courses: Course[] = [
    {
      id: 1,
      titulo: 'HTML y CSS: La Guía Completa',
      nivel: 'Principiante',
      duracion: '20 horas',
      imagen: 'https://img-c.udemycdn.com/course/750x422/45537_4036_5.jpg',
      icono: 'html',
      color: 'purple'
    },
    {
      id: 2,
      titulo: 'JavaScript Moderno: ES6+',
      nivel: 'Principiante',
      duracion: '35 horas',
      imagen: 'https://i.ytimg.com/vi/mxOT2iAehEM/maxresdefault.jpg',
      icono: 'javascript',
      color: 'yellow'
    },
    {
      id: 3,
      titulo: 'React.js: De Cero a Experto',
      nivel: 'Intermedio',
      duracion: '50 horas',
      imagen: 'assets/images/courses/react.jpg',
      icono: 'react',
      color: 'cyan'
    },
    {
      id: 4,
      titulo: 'Backend con Node.js y Express',
      nivel: 'Intermedio',
      duracion: '45 horas',
      imagen: 'assets/images/courses/nodejs.jpg',
      icono: 'nodejs',
      color: 'green'
    },
    {
      id: 5,
      titulo: 'Fundamentos de Bases de Datos SQL',
      nivel: 'Principiante',
      duracion: '30 horas',
      imagen: 'assets/images/courses/sql.jpg',
      icono: 'database',
      color: 'blue'
    },
    {
      id: 6,
      titulo: 'Despliegue de Aplicaciones Web',
      nivel: 'Avanzado',
      duracion: '25 horas',
      imagen: 'assets/images/courses/devops.jpg',
      icono: 'cloud',
      color: 'indigo'
    }
  ];

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
      testimonio: 'Los cursos de AcademiaPro me dieron la confianza y las habilidades para cambiar de carrera y conseguir mi primer trabajo como desarrolladora front-end. ¡Totalmente recomendado!',
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
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  get filteredCourses(): Course[] {
    if (this.selectedFilter === 'Todos') {
      return this.courses;
    }
    return this.courses.filter(course => course.nivel === this.selectedFilter);
  }

  toggleFAQ(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }

  getColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'purple': 'bg-purple-500',
      'yellow': 'bg-yellow-400',
      'cyan': 'bg-cyan-500',
      'green': 'bg-green-600',
      'blue': 'bg-blue-600',
      'indigo': 'bg-indigo-600'
    };
    return colorMap[color] || 'bg-blue-600';
  }
}