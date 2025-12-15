import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NOTICIAS, EVENTOS, TESTIMONIOS, CLUBES } from './data/vida-lumina-data';

@Component({
    selector: 'app-vida-lumina',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './vida-lumina.html',
})
export class VidaLumina {
    noticias = NOTICIAS;
    eventos = EVENTOS;
    testimonios = TESTIMONIOS;
    clubes = CLUBES;
}
