import { Module } from "./module";
import { TestimonialDetailCourse } from "./testimonial";

export interface CourseDetalles {
    id: number;
    titulo: string;
    descripcion: string;
    duracion: string;
    modalidad: string;
    certificacion: string;
    nivel: string;
    precio: number;
    precioOriginal?: number;
    imagen: string;
    instructor: {
        nombre: string;
        cargo: string;
        bio: string;
        avatar: string;
        linkedIn?: string;
    };
    modulos: Module[];
    requisitos: string[];
    testimonios: TestimonialDetailCourse[];
}