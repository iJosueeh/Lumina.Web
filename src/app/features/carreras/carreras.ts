import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarreraService } from './services/carrera.service';
import { Carrera } from '@app/core/models/carrera';

@Component({
    selector: 'app-carreras',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './carreras.html',
})
export class Carreras implements OnInit {
    private carreraService = inject(CarreraService);

    carreras: Carrera[] = [];
    filteredCarreras: Carrera[] = [];

    // Filter states
    searchQuery: string = '';
    selectedCategory: string = 'All';

    categories: string[] = [
        'All',
        'Desarrollo de Software',
        'Ciberseguridad',
        'Ciencia de Datos',
        'Computación en la Nube',
        'IA y Aprendizaje Automático'
    ];

    ngOnInit(): void {
        this.loadCarreras();
    }

    loadCarreras(): void {
        this.carreraService.getAllCarreras().subscribe({
            next: (data) => {
                this.carreras = data;
                this.applyFilters();
            },
            error: (error) => console.error('Error loading carreras', error)
        });
    }

    setCategory(category: string): void {
        this.selectedCategory = category;
        this.applyFilters();
    }

    applyFilters(): void {
        this.filteredCarreras = this.carreras.filter(carrera => {
            const matchesSearch = carrera.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                carrera.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchesCategory = this.selectedCategory === 'All' || carrera.categoria === this.selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }

    onSearchChange(): void {
        this.applyFilters();
    }
}
