import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Course } from '@app/core/models/course.model';
import { CursosService } from '@app/core/services/cursos.service';
import { ErrorMessageComponent } from '@app/shared/components/error-message/error-message';
import { scrollToTop } from '@shared/utils/form.utils';

@Component({
  selector: 'app-course-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ErrorMessageComponent],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  cursosService = inject(CursosService);
  private route = inject(ActivatedRoute);

  searchTerm = signal('');
  selectedCategoria = signal('');
  selectedNivel = signal('');
  currentPage = signal(1);
  itemsPerPage = 6;

  allCourses = signal<Course[]>([]);

  categorias = computed(() => {
    const set = new Set<string>();
    this.allCourses().forEach(course => {
      if (course.categoria) set.add(course.categoria);
    });
    return ['Todas las categorías', ...Array.from(set)];
  });

  niveles = computed(() => {
    const set = new Set<string>();
    this.allCourses().forEach(course => {
      if (course.nivel) set.add(course.nivel);
    });
    return ['Todos los niveles', ...Array.from(set)];
  });

  filteredCourses = computed(() => {
    let filtered = this.allCourses();

    const term = this.searchTerm();
    if (term) {
      filtered = filtered.filter(course =>
        course.titulo.toLowerCase().includes(term.toLowerCase()) ||
        course.descripcion.toLowerCase().includes(term.toLowerCase())
      );
    }

    const categoria = this.selectedCategoria();
    if (categoria && categoria !== 'Todas las categorías') {
      filtered = filtered.filter(course => course.categoria === categoria);
    }

    const nivel = this.selectedNivel();
    if (nivel && nivel !== 'Todos los niveles') {
      filtered = filtered.filter(course => course.nivel === nivel);
    }

    return filtered;
  });

  paginatedCourses = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCourses().slice(startIndex, endIndex);
  });

  totalPages = computed(() => Math.ceil(this.filteredCourses().length / this.itemsPerPage));

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    scrollToTop();
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.selectedCategoria.set(params['categoria']);
      }
    });
    this.loadCourses();
  }

  loadCourses(): void {
    this.cursosService.getAllCourses().subscribe({
      next: (courses) => {
        this.allCourses.set(courses);
      },
      error: (error) => {
        console.error('Error al cargar los cursos:', error);
      }
    });
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  updateCategoria(value: string): void {
    this.selectedCategoria.set(value);
    this.currentPage.set(1);
  }

  updateNivel(value: string): void {
    this.selectedNivel.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategoria.set('');
    this.selectedNivel.set('');
    this.currentPage.set(1);
  }

  getBadgeColor(color: string | undefined, type: 'bg' | 'text'): string {
    const colors: { [key: string]: { bg: string, text: string } } = {
      'teal': { bg: 'bg-teal-100', text: 'text-teal-700' },
      'gray': { bg: 'bg-gray-100', text: 'text-gray-700' },
      'blue': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'purple': { bg: 'bg-purple-100', text: 'text-purple-700' }
    };
    return colors[color || 'gray']?.[type] || colors['gray'][type];
  }
}