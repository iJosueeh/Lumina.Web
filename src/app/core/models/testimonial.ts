export interface Testimonial {
    id: number;
    nombre: string;
    cargo: string;
    empresa: string;
    testimonio: string;
    avatar: string;
}

export type TestimonialDetailCourse = Omit<Testimonial, 'empresa'>;