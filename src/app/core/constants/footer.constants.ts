export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  route?: string;
  href?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Lumina',
    links: [
      { label: 'Sobre Nosotros', route: '/sobre-nosotros' },
      { label: 'Carreras', route: '/cursos' },
      { label: 'Eventos', route: '/noticias-eventos' },
      { label: 'Blog', href: '#' }
    ]
  },
  {
    title: 'Programas',
    links: [
      { label: 'Desarrollo Web', route: '/cursos' },
      { label: 'Data Science', route: '/cursos' },
      { label: 'Marketing Digital', route: '/cursos' },
      { label: 'Diseño UX/UI', route: '/cursos' }
    ]
  },
  {
    title: 'Admisiones',
    links: [
      { label: 'Cómo Funciona', route: '/sobre-nosotros' },
      { label: 'Precios', route: '/cursos' },
      { label: 'Preguntas Frecuentes', route: '/contacto' },
      { label: 'Contacto', route: '/contacto' }
    ]
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Biblioteca', href: '#' },
      { label: 'Tutoriales', href: '#' },
      { label: 'Comunidad', href: '#' },
      { label: 'Soporte', route: '/contacto' }
    ]
  }
];

export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { label: 'Términos de Servicio', href: '#' },
  { label: 'Política de Privacidad', href: '#' },
  { label: 'Política de Reembolso', href: '#' }
];

export const FOOTER_SOCIAL_LINKS: SocialLink[] = [
  { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
  { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { name: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
  { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' }
];

export const FOOTER_CONTACT_INFO: ContactInfo = {
  email: 'contacto@lumina.edu',
  phone: '+51 54 456 789',
  address: 'Av. Lima 1234, Piura, Perú'
};
