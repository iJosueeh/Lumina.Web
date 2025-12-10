export interface RegisterRequest {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    password: string;
    fechaNacimiento: string; // ISO format: YYYY-MM-DD
    correo: string;
    pais: string;
    departamento: string;
    provincia: string;
    distrito: string;
    calle: string;
}
