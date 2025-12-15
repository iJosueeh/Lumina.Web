export interface EventoCalendario {
    titulo: string;
    fecha: string;
    descripcion: string;
    icono: string;
}

export interface PreguntaFrecuente {
    pregunta: string;
    respuesta: string;
    categoria: string;
}

export interface PasoAdmision {
    numero: number;
    titulo: string;
    descripcion: string;
    icono: string;
}

export const PASOS_ADMISION: PasoAdmision[] = [
    {
        numero: 1,
        titulo: 'Envía tu Postulación',
        descripcion: 'Completa nuestro sencillo formulario en línea y adjunta todos los documentos requeridos.',
        icono: 'document'
    },
    {
        numero: 2,
        titulo: 'Entrevista Técnica',
        descripcion: 'Demuestra tus habilidades y pasión en una entrevista técnica con nuestros instructores.',
        icono: 'users'
    },
    {
        numero: 3,
        titulo: 'Recibe tu Oferta',
        descripcion: 'Los candidatos seleccionados recibirán una oferta de admisión para unirse a nuestro programa.',
        icono: 'check'
    }
];

export const EVENTOS_CALENDARIO: EventoCalendario[] = [
    {
        titulo: 'Apertura de Postulaciones',
        fecha: '1 de Enero, 2026',
        descripcion: 'El portal de admisiones está abierto para todos los nuevos postulantes.',
        icono: 'calendar'
    },
    {
        titulo: 'Cierre de Postulaciones',
        fecha: '29 de Febrero, 2026',
        descripcion: 'Asegúrate de haber enviado todos los documentos antes de esta fecha.',
        icono: 'calendar'
    },
    {
        titulo: 'Período de Entrevistas',
        fecha: '1-15 de Marzo, 2026',
        descripcion: 'Los candidatos preseleccionados serán contactados para programar su entrevista técnica.',
        icono: 'calendar'
    },
    {
        titulo: 'Publicación de Resultados',
        fecha: '21 de Marzo, 2026',
        descripcion: 'Las ofertas de admisión serán enviadas por correo electrónico.',
        icono: 'calendar'
    }
];

export const PREGUNTAS_FAQ: PreguntaFrecuente[] = [
    {
        pregunta: '¿Cuál es el costo de la matrícula?',
        respuesta: 'El costo de matrícula varía según el programa seleccionado. Contamos con opciones de financiamiento y becas para estudiantes destacados. Te recomendamos contactar a nuestra oficina de admisiones para obtener información detallada sobre costos y opciones de pago.',
        categoria: 'Costos'
    },
    {
        pregunta: '¿Necesito experiencia previa en programación?',
        respuesta: 'No es necesario tener experiencia previa en programación para la mayoría de nuestros programas. Ofrecemos cursos desde nivel principiante hasta avanzado. Durante el proceso de admisión evaluaremos tu nivel actual y te recomendaremos el programa más adecuado para ti.',
        categoria: 'Requisitos'
    },
    {
        pregunta: '¿Qué documentos necesito para postular?',
        respuesta: 'Para completar tu postulación necesitarás: documento de identidad, certificado de estudios previos, carta de motivación, y CV actualizado. Algunos programas pueden requerir documentación adicional que te será indicada durante el proceso de postulación.',
        categoria: 'Proceso'
    }
];
