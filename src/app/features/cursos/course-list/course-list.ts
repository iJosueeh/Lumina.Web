import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseLista } from '@app/core/models/course-lista';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  searchTerm = '';
  selectedCategoria = '';
  selectedNivel = '';
  selectedUbicacion = '';

  currentPage = 1;
  itemsPerPage = 6;

  categorias = [
    'Todas las categorías',
    'Programación',
    'Diseño',
    'Marketing',
    'Data Science',
    'Negocios'
  ];

  niveles = [
    'Todos los niveles',
    'Principiante',
    'Intermedio',
    'Avanzado'
  ];

  ubicaciones = [
    'Todas las ubicaciones',
    'Online',
    'Presencial',
    'Híbrido'
  ];

  allCourses: CourseLista[] = [
    {
      id: 1,
      titulo: 'Introducción a la Programación',
      descripcion: 'Aprende los conceptos básicos de la codificación desde cero.',
      categoria: 'Programación',
      nivel: 'Principiante',
      imagen: 'assets/images/courses/programacion-intro.jpg',
      badge1: 'PROGRAMACIÓN',
      badge2: 'PRINCIPIANTE',
      colorBadge1: 'teal',
      colorBadge2: 'gray'
    },
    {
      id: 2,
      titulo: 'Diseño Gráfico para Principiantes',
      descripcion: 'Domina las herramientas esenciales del diseño visual.',
      categoria: 'Diseño',
      nivel: 'Principiante',
      imagen: 'assets/images/courses/diseno-grafico.jpg',
      badge1: 'DISEÑO',
      badge2: 'PRINCIPIANTE',
      colorBadge1: 'teal',
      colorBadge2: 'gray'
    },
    {
      id: 3,
      titulo: 'Marketing Digital Avanzado',
      descripcion: 'Lleva tu campaña de marketing al siguiente nivel.',
      categoria: 'Marketing',
      nivel: 'Avanzado',
      imagen: 'assets/images/courses/marketing-digital.jpg',
      badge1: 'MARKETING',
      badge2: 'AVANZADO',
      colorBadge1: 'teal',
      colorBadge2: 'gray'
    },
    {
      id: 4,
      titulo: 'Fundamentos de Python',
      descripcion: 'Descubre el poder de uno de los lenguajes más populares.',
      categoria: 'Programación',
      nivel: 'Intermedio',
      imagen: 'assets/images/courses/python.jpg',
      badge1: 'PROGRAMACIÓN',
      badge2: 'INTERMEDIO',
      colorBadge1: 'teal',
      colorBadge2: 'gray'
    },
    {
      id: 5,
      titulo: 'Curso de Ilustración Digital',
      descripcion: 'Crea arte digital impactante con técnicas profesionales.',
      categoria: 'Diseño',
      nivel: 'Intermedio',
      imagen: 'assets/images/courses/ilustracion.jpg',
      badge1: 'DISEÑO',
      badge2: 'INTERMEDIO',
      colorBadge1: 'teal',
      colorBadge2: 'gray'
    },
    {
      id: 6,
      titulo: 'Estrategias de SEO',
      descripcion: 'Optimiza tu sitio web para los motores de búsqueda.',
      categoria: 'Marketing',
      nivel: 'Avanzado',
      imagen: 'assets/images/courses/seo.jpg',
      badge1: 'MARKETING',
      badge2: 'AVANZADO',
      colorBadge1: 'teal',
      colorBadge2: 'gray'
    },
    {
      id: 7,
      titulo: 'React.js Avanzado',
      descripcion: 'Domina React con hooks, context y patrones avanzados.',
      categoria: 'Programación',
      nivel: 'Avanzado',
      imagen: 'assets/images/courses/react-avanzado.jpg',
      badge1: 'PROGRAMACIÓN',
      badge2: 'AVANZADO',
      colorBadge1: 'teal',
      colorBadge2: 'gray'
    },
    {
      id: 8,
      titulo: 'UX/UI Design Completo',
      descripcion: 'Diseña experiencias de usuario excepcionales.',
      categoria: 'Diseño',
      nivel: 'Intermedio',
      imagen: 'assets/images/courses/ux-ui.jpg',
      badge1: 'DISEÑO',
      badge2: 'INTERMEDIO',
      colorBadge1: 'teal',
      colorBadge2: 'gray'
    }
  ];

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  get filteredCourses(): CourseLista[] {
    let filtered = this.allCourses;

    if (this.searchTerm) {
      filtered = filtered.filter(course =>
        course.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategoria && this.selectedCategoria !== 'Todas las categorías') {
      filtered = filtered.filter(course => course.categoria === this.selectedCategoria);
    }

    if (this.selectedNivel && this.selectedNivel !== 'Todos los niveles') {
      filtered = filtered.filter(course => course.nivel === this.selectedNivel);
    }

    return filtered;
  }

  get paginatedCourses(): CourseLista[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCourses.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoria = '';
    this.selectedNivel = '';
    this.selectedUbicacion = '';
    this.currentPage = 1;
  }

  getBadgeColor(color: string, type: 'bg' | 'text'): string {
    const colors: { [key: string]: { bg: string, text: string } } = {
      'teal': { bg: 'bg-teal-100', text: 'text-teal-700' },
      'gray': { bg: 'bg-gray-100', text: 'text-gray-700' },
      'blue': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'purple': { bg: 'bg-purple-100', text: 'text-purple-700' }
    };
    return colors[color]?.[type] || colors['gray'][type];
  }
}