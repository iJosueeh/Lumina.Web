import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamMember } from '@app/core/models/team-member';
import { ValueItem } from '@app/core/models/value-item';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.css',
})
export class SobreNosotros implements OnInit {
  teamMembers: TeamMember[] = [
    {
      id: 1,
      nombre: 'Juan Perez',
      cargo: 'Director',
      imagen: 'https://i.postimg.cc/z2z5t0zX/Juan-Perez.jpg',
      bio: 'Con más de 20 años de experiencia en el sector educativo, Juan ha liderado múltiples iniciativas para mejorar la calidad de la enseñanza.'
    },
    {
      id: 2,
      nombre: 'Carlos Perez',
      cargo: 'Director',
      imagen: 'https://i.postimg.cc/z2z5t0zX/Juan-Perez.jpg',
      bio: 'Con más de 20 años de experiencia en el sector educativo, Juan ha liderado múltiples iniciativas para mejorar la calidad de la enseñanza.'
    },
    {
      id: 3,
      nombre: 'Juan Perez',
      cargo: 'Director',
      imagen: 'https://i.postimg.cc/z2z5t0zX/Juan-Perez.jpg',
      bio: 'Con más de 20 años de experiencia en el sector educativo, Juan ha liderado múltiples iniciativas para mejorar la calidad de la enseñanza.'
    },
    {
      id: 4,
      nombre: 'Carlos Perez',
      cargo: 'Director',
      imagen: 'https://i.postimg.cc/z2z5t0zX/Juan-Perez.jpg',
      bio: 'Con más de 20 años de experiencia en el sector educativo, Juan ha liderado múltiples iniciativas para mejorar la calidad de la enseñanza.'
    }
  ];

  valores: ValueItem[] = [
    {
      icono: 'target',
      titulo: 'Nuestra Misión',
      descripcion: 'Ofrecer una experiencia educativa transformadora que capacite a los estudiantes para alcanzar su máximo potencial y tener un impacto positivo en el mundo.'
    },
    {
      icono: 'eye',
      titulo: 'Nuestra Visión',
      descripcion: 'Ser un líder mundial en educación, reconocido por nuestros métodos de enseñanza innovadores, compromiso con la excelencia y compromiso con el éxito estudiantil.'
    },
    {
      icono: 'star',
      titulo: 'Nuestros Valores',
      descripcion: 'Mantenemos los más altos estándares de integridad, fomentamos una cultura de excelencia académica, promovemos la innovación y el progreso, y crear oportunidades.'
    }
  ];

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  getIconPath(iconName: string): string {
    const icons: { [key: string]: string } = {
      'target': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
      'eye': 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
      'star': 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
    };
    return icons[iconName] || icons['star'];
  }

}