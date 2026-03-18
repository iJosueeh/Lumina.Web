export interface RegisterRequest {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    password: string;
    correo: string;
    carreraId?: string; // Opcional para matrícula
    
    // Campos opcionales
    fechaNacimiento?: string; // ISO format: YYYY-MM-DD
    pais?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    calle?: string;
}

// Request para registro con matrícula a un curso
export interface RegisterWithEnrollmentRequest {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    password: string;
    carreraId?: string | null; // ID del curso/programación al que se matriculará
    cursoNombre?: string | null; // Nombre del curso para resolver programación correcta
    
    // Dirección
    fechaNacimiento?: string;
    pais?: string;
    departamento?: string;
    provincia?: string;
    distrito?: string;
    calle?: string;
}

// Response específico para registro con matrícula
export interface RegisterWithEnrollmentResponse {
    userId: string;
    message: string;
    profileCreated: boolean;
}

// Response para verificación de usuario por correo
export interface VerificarUsuarioResponse {
    existe: boolean;
    mensaje?: string;
}

// Request para login con matrícula
export interface LoginWithEnrollmentRequest {
    email: string;
    password: string;
    cursoId: string;
}

