export interface Course {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: string;
    nivel: string;
    imagen: string;
    badge1?: string;
    badge2?: string;
    colorBadge1?: string;
    colorBadge2?: string;
}

export interface CourseDetails extends Course {
    duracion: string;
    modalidad: string;
    certificacion: string;
    precio: number;
    precioOriginal?: number;
    instructor: Instructor;
    modulos: Module[];
    requisitos: string[];
    testimonios: Testimonial[];
}

export interface Instructor {
    nombre: string;
    cargo: string;
    bio: string;
    avatar: string;
    linkedIn?: string;
}

export interface Module {
    id: string;
    titulo: string;
    descripcion: string;
    lecciones: number;
}

export interface Testimonial {
    autor: string;
    comentario: string;
    calificacion: number;
    avatarUrl: string;
}

export interface EnrolledCourse extends Course {
    progreso: number; // 0-100
    ultimaActividad: Date;
    proximaClase?: {
        fecha: Date;
        tema: string;
    };
    calificacionActual?: number;
}
