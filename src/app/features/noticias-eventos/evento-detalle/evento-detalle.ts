import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../services/eventos.service';

@Component({
    selector: 'app-evento-detalle',
    standalone: true,
    imports: [CommonModule, DatePipe],
    templateUrl: './evento-detalle.html',
})
export class EventoDetalleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private eventosService = inject(EventosService);

    eventoId: string = '';
    evento: any = null;
    loading = true;
    error = false;

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.eventoId = params['id'];
            this.loadEvento();
        });
    }

    loadEvento(): void {
        this.loading = true;
        this.error = false;

        this.eventosService.getEventoById(this.eventoId).subscribe({
            next: (evento) => {
                this.evento = evento;
                this.loading = false;
                window.scrollTo(0, 0);
            },
            error: (err) => {
                console.error('Error loading evento', err);
                this.error = true;
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/noticias-eventos']);
    }

    compartir(): void {
        const url = encodeURIComponent(window.location.href);
        const texto = encodeURIComponent(this.evento?.titulo || '');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${texto}`, '_blank');
    }
}
