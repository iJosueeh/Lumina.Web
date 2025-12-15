export interface Noticia {
    id: string;
    titulo: string;
    descripcion: string;
    imagenUrl: string;
    fecha: string;
    categoria: string;
    badge: {
        texto: string;
        color: string;
    };
    // Campos opcionales del backend
    autor?: string;
    autorAvatar?: string;
    tiempoLectura?: string;
    contenido?: string;
    tags?: string[];
}
