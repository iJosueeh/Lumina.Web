export interface Module {
    id: number;
    titulo: string;
    descripcion: string;
    isExpanded: boolean;
    lecciones?: string[];
}