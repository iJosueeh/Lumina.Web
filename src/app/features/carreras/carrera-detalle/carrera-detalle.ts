import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Carrera } from '@app/core/models/carrera';
import { CarreraService } from '../services/carrera.service';

@Component({
    selector: 'app-carrera-detalle',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './carrera-detalle.html',
})
export class CarreraDetalleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private carreraService = inject(CarreraService);

    carreraId: string = '';
    carrera: Carrera | null = null;
    loading = true;

    selectedModulo = 1;

    ngOnInit(): void {
        this.carreraId = this.route.snapshot.params['id'];
        this.loadCarreraDetalle();
    }

    loadCarreraDetalle(): void {
        this.carreraService.getById(this.carreraId).subscribe({
            next: (data) => {
                this.carrera = data;
                this.loading = false;
                window.scrollTo(0, 0);
            },
            error: (error) => {
                console.error('Error loading carrera details', error);
                this.loading = false;
            }
        });
    }

    setModulo(numero: number): void {
        this.selectedModulo = numero;
    }

    scrollToSection(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
