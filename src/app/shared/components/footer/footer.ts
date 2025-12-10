import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterLink } from '@app/core/models/footer-link';
import { FooterSection } from '@app/core/models/footer-section';
import { SocialLink } from '@app/core/models/social-link';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();

  footerSections: FooterSection[] = [
    {
      title: 'Lumina',
      links: [
        { label: 'Sobre Nosotros', route: '/sobre-nosotros' },
        { label: 'Nuestra Misión', route: '/sobre-nosotros#mision' },
        { label: 'Equipo', route: '/sobre-nosotros#equipo' },
        { label: 'Carreras', route: '/carreras' }
      ]
    },
    {
      title: 'Programas',
      links: [
        { label: 'Ver Todos', route: '/programas' },
        { label: 'Pregrado', route: '/programas/pregrado' },
        { label: 'Posgrado', route: '/programas/posgrado' },
        { label: 'Cursos Online', route: '/programas/online' }
      ]
    },
    {
      title: 'Admisiones',
      links: [
        { label: 'Cómo Aplicar', route: '/admisiones' },
        { label: 'Requisitos', route: '/admisiones/requisitos' },
        { label: 'Becas', route: '/admisiones/becas' },
        { label: 'Financiamiento', route: '/admisiones/financiamiento' }
      ]
    },
    {
      title: 'Recursos',
      links: [
        { label: 'Blog', route: '/blog' },
        { label: 'Eventos', route: '/eventos' },
        { label: 'Biblioteca', route: '/biblioteca' },
        { label: 'FAQ', route: '/faq' }
      ]
    }
  ];

  legalLinks: FooterLink[] = [
    { label: 'Política de Privacidad', route: '/politica-privacidad' },
    { label: 'Términos de Servicio', route: '/terminos-servicio' },
    { label: 'Cookies', route: '/cookies' }
  ];

  socialLinks: SocialLink[] = [
    { name: 'Facebook', url: 'https://facebook.com/lumina', icon: 'facebook' },
    { name: 'Twitter', url: 'https://twitter.com/lumina', icon: 'twitter' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/lumina', icon: 'linkedin' },
    { name: 'Instagram', url: 'https://instagram.com/lumina', icon: 'instagram' },
    { name: 'YouTube', url: 'https://youtube.com/lumina', icon: 'youtube' }
  ];

  contactInfo = {
    email: 'contacto@lumina.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Education St, Learning City, LC 12345'
  };
}