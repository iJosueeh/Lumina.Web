export interface CursoModulo {
    nombre: string;
    creditos: number;
    descripcion: string;
}

export interface Modulo {
    numero: number;
    nombre: string;
    cursos: CursoModulo[];
}

export interface Testimonio {
    nombre: string;
    cargo: string;
    empresa: string;
    texto: string;
    avatarUrl: string;
}

export interface Carrera {
    id: string;
    nombre: string;
    descripcion: string;
    imagenUrl: string;
    categoria: string;
    duracion: string;
    activa: boolean;

    // Rich data properties
    modalidad: string[];
    nivelAcademico: string;
    creditosTotales: number;
    certificacion: string;
    planEstudios: Modulo[];
    perfilEgresado: string[];
    competencias: string[];
    campoLaboral: string[];
    requisitos: string[];
    testimonios: Testimonio[];
    tasaEmpleabilidad: number;
    salarioPromedio: string;
}
