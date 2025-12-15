import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../core/models/noticia';
import { EventoProximo } from '../../core/models/evento-proximo';
import { Categoria } from '../../core/models/categoria';
import { NoticiasService } from './services/noticias.service';
import { EventosService } from './services/eventos.service';

@Component({
    selector: 'app-noticias-eventos',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './noticias-eventos.html',
})
export class NoticiasEventos implements OnInit {
    private noticiasService = inject(NoticiasService);
    private eventosService = inject(EventosService);

    searchQuery: string = '';
    selectedCategory: string = 'todos';

    categorias: Categoria[] = [];
    todasNoticias: Noticia[] = [];
    eventos: EventoProximo[] = [];

    filteredNoticias: Noticia[] = [];
    displayedNoticias: Noticia[] = [];
    noticiasPerPage = 4;
    currentPage = 1;

    ngOnInit(): void {
        this.loadCategorias();
        this.loadNoticias();
        this.loadEventosProximos();
    }

    loadCategorias(): void {
        this.noticiasService.getCategorias().subscribe({
            next: (cats) => {
                this.categorias = [
                    { id: 'todos', nombre: 'Todos' },
                    ...cats.map(c => ({ id: c.toLowerCase(), nombre: c }))
                ];
            },
            error: (err) => {
                console.error('Error loading categories', err);
                // Default categories if backend fails
                this.categorias = [
                    { id: 'todos', nombre: 'Todos' },
                    { id: 'academico', nombre: 'Académico' },
                    { id: 'cultural', nombre: 'Cultural' },
                    { id: 'workshops', nombre: 'Workshops' },
                    { id: 'tecnologia', nombre: 'Tecnología' },
                    { id: 'vida-estudiantil', nombre: 'Vida Estudiantil' }
                ];
            }
        });
    }

    loadNoticias(): void {
        this.noticiasService.getNoticias({
            page: this.currentPage,
            pageSize: this.noticiasPerPage,
            categoria: this.selectedCategory !== 'todos' ? this.selectedCategory : undefined,
            search: this.searchQuery.trim() || undefined
        }).subscribe({
            next: (noticias) => {
                if (this.currentPage === 1) {
                    this.todasNoticias = noticias;
                    this.displayedNoticias = noticias;
                } else {
                    // Load more: append to existing
                    this.todasNoticias = [...this.todasNoticias, ...noticias];
                    this.displayedNoticias = this.todasNoticias;
                }
                this.filteredNoticias = this.todasNoticias;
            },
            error: (err) => {
                console.error('Error loading noticias', err);
                // Show empty state on error
                this.todasNoticias = [];
                this.filteredNoticias = [];
                this.displayedNoticias = [];
            }
        });
    }

    loadEventosProximos(): void {
        this.eventosService.getEventosProximos().subscribe({
            next: (eventos) => {
                this.eventos = eventos;
            },
            error: (err) => {
                console.error('Error loading eventos', err);
                this.eventos = [];
            }
        });
    }

    setCategory(categoryId: string): void {
        this.selectedCategory = categoryId;
        this.currentPage = 1;
        this.loadNoticias(); // Reload from backend
    }

    onSearch(): void {
        this.currentPage = 1;
        this.loadNoticias(); // Reload from backend
    }



    loadMore(): void {
        this.currentPage++;
        this.loadNoticias();
    }

    get hasMoreNoticias(): boolean {
        // Si la última carga trajo menos noticias que pageSize, no hay más
        return this.displayedNoticias.length % this.noticiasPerPage === 0 && this.displayedNoticias.length > 0;
    }

    getBadgeColorClass(color: string): string {
        const colorMap: { [key: string]: string } = {
            'orange': 'bg-orange-500',
            'green': 'bg-green-700',
            'gray': 'bg-gray-500',
            'yellow': 'bg-yellow-500',
            'purple': 'bg-purple-500',
            'blue': 'bg-blue-500'
        };
        return colorMap[color] || 'bg-gray-500';
    }
}
