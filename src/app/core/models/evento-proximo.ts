export interface EventoProximo {
    id: string;
    titulo: string;
    fecha: string;
    mes: string;
    dia: string;
    hora: string;
    tipo: string;
    botonTexto: string;
    botonTipo: 'primary' | 'secondary';
}
