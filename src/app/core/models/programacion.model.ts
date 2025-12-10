export interface Programacion {
    id: string;
    cursoId: string;
    cursoNombre: string;
    docenteId: string;
    docenteNombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    modalidad: 'Presencial' | 'Virtual';
    linkVirtual?: string;
    aula?: string;
    tema?: string;
}

export interface CalendarioEvento {
    id: string;
    titulo: string;
    tipo: 'Clase' | 'Evaluacion' | 'Entrega';
    fecha: Date;
    duracion: number; // minutos
    cursoId: string;
    cursoNombre: string;
    descripcion?: string;
    color?: string;
}
