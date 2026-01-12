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

// Response específico para registro con matrícula
export interface RegisterWithEnrollmentResponse {
    userId: string;
    message: string;
    profileCreated: boolean;
}

