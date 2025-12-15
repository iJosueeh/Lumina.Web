export interface Noticia {
    id: string;
    titulo: string;
    descripcion: string;
    imagenUrl: string;
    fecha: string;
    categoria: string;
}

export interface Evento {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: string;
    mes: string;
    dia: string;
    tipo: 'charla' | 'hackathon' | 'workshop' | 'otro';
    botonTexto: string;
    botonTipo: 'primary' | 'secondary';
}

export interface Testimonio {
    id: string;
    nombre: string;
    cargo: string;
    empresa: string;
    testimonio: string;
    avatarUrl: string;
}

export interface Club {
    id: string;
    nombre: string;
    descripcion: string;
    icono: string;
}

export const NOTICIAS: Noticia[] = [
    {
        id: '1',
        titulo: 'Lumina.Core Lanza Nuevo Bootcamp de IA',
        descripcion: 'Descubre nuestro nuevo programa intensivo diseñado para formar a la próxima generación de expertos en inteligencia artificial y machine learning.',
        imagenUrl: 'https://i.pravatar.cc/400?img=1',
        fecha: '2024-07-15',
        categoria: 'Programas'
    },
    {
        id: '2',
        titulo: 'Alumnos Ganan Premio Nacional de Innovación',
        descripcion: 'Un equipo de nuestros estudiantes ha sido galardonado por su proyecto revolucionario en el campo de la tecnología sostenible.',
        imagenUrl: 'https://i.pravatar.cc/400?img=33',
        fecha: '2024-07-10',
        categoria: 'Logros'
    },
    {
        id: '3',
        titulo: 'Feria de Empleo Conecta',
        descripcion: 'Nuestra feria anual de empleo fue un éxito rotundo, conectando a estudiantes con las mejores empresas tecnológicas del país.',
        imagenUrl: 'https://i.pravatar.cc/400?img=5',
        fecha: '2024-07-05',
        categoria: 'Eventos'
    }
];

export const EVENTOS: Evento[] = [
    {
        id: '1',
        titulo: 'Charla: IA en el Desarrollo Moderno',
        descripcion: 'Únete a la Dra. Evelyn Reed, líder en la industria, para una charla sobre el futuro de la IA.',
        fecha: '2024-07-28',
        mes: 'JUL',
        dia: '28',
        tipo: 'charla',
        botonTexto: 'Registrarse',
        botonTipo: 'primary'
    },
    {
        id: '2',
        titulo: 'Hackathon Anual Lumina.Core 2026',
        descripcion: 'Forma un equipo y crea algo increíble en nuestra competencia de 48 horas. ¡Habrá premios!',
        fecha: '2026-08-15',
        mes: 'AGO',
        dia: '15',
        tipo: 'hackathon',
        botonTexto: 'Saber más',
        botonTipo: 'secondary'
    }
];

export const TESTIMONIOS: Testimonio[] = [
    {
        id: '1',
        nombre: 'Ana Rodriguez',
        cargo: 'Software Engineer',
        empresa: 'TechCorp',
        testimonio: 'Los proyectos prácticos y la mentoría en Lumina.Core fueron cruciales para mi transición de carrera a la tecnología. Me sentí apoyada en cada paso.',
        avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    {
        id: '2',
        nombre: 'Carlos Vega',
        cargo: 'UX/UI Designer',
        empresa: 'Innovate',
        testimonio: 'El ambiente colaborativo y el enfoque en resolver problemas reales me dieron la confianza para liderar proyectos de diseño desde el primer día.',
        avatarUrl: 'https://i.pravatar.cc/150?img=33'
    },
    {
        id: '3',
        nombre: 'Sofía Chen',
        cargo: 'Data Scientist',
        empresa: 'DataDriven Inc.',
        testimonio: 'El currículo de Lumina.Core es increíblemente relevante. Usé las mismas herramientas en mi trabajo que en mi proyecto final.',
        avatarUrl: 'https://i.pravatar.cc/150?img=5'
    }
];

export const CLUBES: Club[] = [
    {
        id: '1',
        nombre: 'Club de Programación Competitiva',
        descripcion: 'Perfecciona tus habilidades de resolución de problemas, participa en competencias y prepárate para entrevistas técnicas.',
        icono: 'terminal'
    },
    {
        id: '2',
        nombre: 'Laboratorio de Innovación y Emprendimiento',
        descripcion: 'Colabora en proyectos innovadores, desarrolla tus ideas y aprende a crear tu propia startup tecnológica.',
        icono: 'lightbulb'
    },
    {
        id: '3',
        nombre: 'Comunidad de Voluntariado Tech',
        descripcion: 'Usa tus habilidades para el bien social. Participa en proyectos que generan un impacto positivo en la comunidad.',
        icono: 'group'
    },
    {
        id: '4',
        nombre: 'Club de Desarrollo de Videojuegos',
        descripcion: 'Desde el arte conceptual hasta la programación. Únete a otros entusiastas para crear los juegos del futuro.',
        icono: 'sports_esports'
    }
];
