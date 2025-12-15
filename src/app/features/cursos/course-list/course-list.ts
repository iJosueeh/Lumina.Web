import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseLista } from '@app/core/models/course-lista';
import { CursoService } from '@app/features/cursos/services/curso.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  private cursoService = inject(CursoService);

  searchTerm = '';
  selectedCategoria = '';
  selectedNivel = '';

  currentPage = 1;
  itemsPerPage = 6;

  categorias: string[] = ['Todas las categorías'];

  niveles: string[] = ['Todos los niveles'];

  allCourses: CourseLista[] = [];

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadCourses();
    this.loadCategorias();
    this.loadNiveles();
  }

  loadCourses(): void {
    this.cursoService.getAllCourses().subscribe({
      next: (courses) => {
        this.allCourses = courses;
      },
      error: (error) => {
        console.error('Error al cargar los cursos:', error);
      }
    });
  }

  loadCategorias(): void {
    this.cursoService.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = ['Todas las categorías', ...cats];
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  loadNiveles(): void {
    this.cursoService.getNiveles().subscribe({
      next: (nivs) => {
        this.niveles = ['Todos los niveles', ...nivs];
      },
      error: (error) => {
        console.error('Error al cargar niveles:', error);
      }
    });
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