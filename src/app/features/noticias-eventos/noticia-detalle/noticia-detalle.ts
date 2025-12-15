import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoticiasService } from '../services/noticias.service';
import { Noticia } from '../../../core/models/noticia';

@Component({
    selector: 'app-noticia-detalle',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './noticia-detalle.html',
})
export class NoticiaDetalleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private noticiasService = inject(NoticiasService);

    noticiaId: string = '';
    noticia: Noticia | null = null;
    noticiasRelacionadas: Noticia[] = [];
    loading = true;
    error = false;

    ngOnInit(): void {
        // Subscribe to route params to reload when navigating between noticias
        this.route.params.subscribe(params => {
            this.noticiaId = params['id'];
            this.loadNoticia();
        });
    }

    loadNoticia(): void {
        this.loading = true;
        this.error = false;

        this.noticiasService.getNoticiaById(this.noticiaId).subscribe({
            next: (noticia) => {
                this.noticia = noticia;
                this.loadNoticiasRelacionadas();
                this.loading = false;
                window.scrollTo(0, 0);
            },
            error: (err) => {
                console.error('Error loading noticia', err);
                this.error = true;
                this.loading = false;
            }
        });
    }

    loadNoticiasRelacionadas(): void {
        if (!this.noticia) return;

        // Obtener noticias de la misma categoría
        this.noticiasService.getNoticias({
            categoria: this.noticia.categoria,
            pageSize: 4
        }).subscribe({
            next: (noticias) => {
                // Filtrar la noticia actual y tomar solo 3
                this.noticiasRelacionadas = noticias
                    .filter(n => n.id !== this.noticiaId)
                    .slice(0, 3);
            },
            error: (err) => {
                console.error('Error loading related noticias', err);
                this.noticiasRelacionadas = [];
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/noticias-eventos']);
    }

    compartirEnFacebook(): void {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }

    compartirEnTwitter(): void {
        const url = encodeURIComponent(window.location.href);
        const texto = encodeURIComponent(this.noticia?.titulo || '');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${texto}`, '_blank');
    }

    compartirEnLinkedIn(): void {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }

    copiarEnlace(): void {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('¡Enlace copiado al portapapeles!');
        });
    }
}
