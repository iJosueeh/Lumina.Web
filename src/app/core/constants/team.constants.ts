export interface TeamMember {
  id: number;
  nombre: string;
  cargo: string;
  bio: string;
  imagen: string;
  linkedIn?: string;
}

export interface ValueItem {
  icono: string;
  titulo: string;
  descripcion: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    nombre: 'Dr. Carlos Mendoza',
    cargo: 'Fundador y Director Académico',
    bio: 'Doctor en Ciencias de la Computación con más de 20 años de experiencia en educación tecnológica. Fundó Lumina con la visión de democratizar el acceso a educación de calidad.',
    imagen: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    linkedIn: 'https://linkedin.com'
  },
  {
    id: 2,
    nombre: 'Dra. María López',
    cargo: 'Directora de Operaciones',
    bio: 'MBA con especialización en EdTech. Lidera las operaciones y estrategia de crecimiento de Lumina, asegurando excelencia operativa.',
    imagen: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    linkedIn: 'https://linkedin.com'
  },
  {
    id: 3,
    nombre: 'Ing. Juan Pérez',
    cargo: 'Director de Tecnología',
    bio: 'Arquitecto de software con experiencia en empresas Fortune 500. Lidera el desarrollo tecnológico de la plataforma.',
    imagen: 'https://images.unsplash.com/photo-1472099645785-5658abf4d00?w=400',
    linkedIn: 'https://linkedin.com'
  },
  {
    id: 4,
    nombre: 'Lic. Ana García',
    cargo: 'Coordinadora Académica',
    bio: 'Profesional en gestión educativa con pasión por la innovación pedagógica. Coordina el contenido y metodología de cursos.',
    imagen: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    linkedIn: 'https://linkedin.com'
  }
];

export const INSTITUTION_VALUES: ValueItem[] = [
  {
    icono: 'mision',
    titulo: 'Nuestra Misión',
    descripcion: 'Democratizar el acceso a educación tecnológica de calidad, empoderando a personas de todas partes del mundo para alcanzar su máximo potencial profesional.'
  },
  {
    icono: 'vision',
    titulo: 'Nuestra Visión',
    descripcion: 'Ser la plataforma educativa líder en Latinoamérica, reconocida por formar profesionales competentes y creativos que impulsan la innovación tecnológica.'
  },
  {
    icono: 'valores',
    titulo: 'Nuestros Valores',
    descripcion: 'Excelencia académica, innovación constante, accesibilidad, comunidad de aprendizaje activa, e integridad en todo lo que hacemos.'
  }
];
