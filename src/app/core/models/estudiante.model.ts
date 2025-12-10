export interface EstudianteInfo {
    id: string;
    usuarioId: string;
    nombres: string;
    apellidos: string;
    email: string;
    avatar?: string;
    fechaRegistro: Date;
}

export interface Matricula {
    id: string;
    estudianteId: string;
    cursoId: string;
    fechaMatricula: Date;
    estado: EstadoMatricula;
    progreso: number; // 0-100
    calificacionFinal?: number;
}

export enum EstadoMatricula {
    Activa = 'Activa',
    Completada = 'Completada',
    Suspendida = 'Suspendida'
}

export interface Progreso {
    cursoId: string;
    modulosCompletados: number;
    modulosTotales: number;
    leccionesCompletadas: number;
    leccionesTotales: number;
    tiempoDedicado: number; // horas
    ultimaActividad: Date;
    porcentajeCompletado: number;
}

export interface DashboardStats {
    cursosActivos: number;
    cursosCompletados: number;
    evaluacionesPendientes: number;
    promedioGeneral: number;
    horasEstudioSemana: number;
}
