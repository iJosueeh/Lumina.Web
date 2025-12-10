export interface Evaluacion {
    id: string;
    titulo: string;
    cursoId: string;
    cursoNombre: string;
    tipo: TipoEvaluacion;
    fechaLimite: Date;
    duracion: number; // minutos
    estado: EstadoEvaluacion;
    calificacion?: number;
    intentos: number;
    intentosMaximos: number;
    descripcion?: string;
}

export enum TipoEvaluacion {
    Quiz = 'Quiz',
    Examen = 'Examen',
    Tarea = 'Tarea',
    Proyecto = 'Proyecto'
}

export enum EstadoEvaluacion {
    Pendiente = 'Pendiente',
    EnProgreso = 'EnProgreso',
    Completada = 'Completada',
    Calificada = 'Calificada'
}

export interface Pregunta {
    id: string;
    texto: string;
    tipo: TipoPregunta;
    opciones?: OpcionRespuesta[];
    puntaje: number;
}

export enum TipoPregunta {
    OpcionMultiple = 'OpcionMultiple',
    VerdaderoFalso = 'VerdaderoFalso',
    RespuestaCorta = 'RespuestaCorta',
    Ensayo = 'Ensayo'
}

export interface OpcionRespuesta {
    id: string;
    texto: string;
}

export interface RespuestaEvaluacion {
    preguntaId: string;
    respuesta: string | string[]; // string para texto, array para múltiple opción
}

export interface ResultadoEvaluacion {
    evaluacionId: string;
    calificacion: number;
    puntajeObtenido: number;
    puntajeTotal: number;
    fechaRealizacion: Date;
    retroalimentacion?: string;
}
