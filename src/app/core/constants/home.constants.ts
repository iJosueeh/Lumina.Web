export interface Benefit {
  icono: string;
  titulo: string;
  descripcion: string;
}

export interface Testimonial {
  autor: string;
  rol: string;
  comentario: string;
  avatarUrl: string;
}

export interface FAQ {
  pregunta: string;
  respuesta: string;
  isOpen: boolean;
}

export const HOME_BENEFITS: Benefit[] = [
  {
    icono: 'instructor',
    titulo: 'Instructores Expertos',
    descripcion: 'Aprende de profesionales con años de experiencia en la industria.'
  },
  {
    icono: 'projects',
    titulo: 'Proyectos Reales',
    descripcion: 'Construye un portafolio sólido trabajando en proyectos del mundo real.'
  },
  {
    icono: 'community',
    titulo: 'Comunidad Activa',
    descripcion: 'Conecta con otros estudiantes y mentores para resolver dudas y colaborar.'
  }
];

export const HOME_TESTIMONIALS: Testimonial[] = [
  {
    autor: 'Ana García',
    rol: 'Estudiante de Angular',
    comentario: 'Los cursos me ayudaron a conseguir mi primer trabajo como desarrolladora frontend. La metodología es excelente.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    autor: 'Carlos Mendoza',
    rol: 'Estudiante de .NET',
    comentario: 'Excelente plataforma. Los proyectos prácticos me dieron la confianza para desarrollar mis propias aplicaciones.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    autor: 'María López',
    rol: 'Profesional Senior',
    comentario: 'Los cursos de Lumina me permiten mantenerme actualizada con las últimas tecnologías del mercado.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  }
];

export const HOME_FAQS: FAQ[] = [
  {
    pregunta: '¿Necesito experiencia previa para inscribirme?',
    respuesta: 'No, nuestros cursos de principiante están diseñados para personas sin experiencia previa. Empezamos desde los fundamentos y avanzamos paso a paso.',
    isOpen: false
  },
  {
    pregunta: '¿Obtendré un certificado al finalizar un curso?',
    respuesta: 'Sí, al completar exitosamente un curso recibirás un certificado digital que puedes compartir en tu LinkedIn y añadir a tu CV.',
    isOpen: false
  },
  {
    pregunta: '¿Tengo acceso de por vida a los cursos que compre?',
    respuesta: 'Sí, una vez que compras un curso tienes acceso ilimitado de por vida, incluyendo todas las actualizaciones futuras del contenido.',
    isOpen: false
  }
];
