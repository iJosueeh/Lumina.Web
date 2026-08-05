export const environment = {
  production: false,
  // Microservicios Backend via API Gateway (Port 5100)
  apiUrl: 'http://localhost:5100/usuarios/api',              // Usuarios
  coursesUrl: 'http://localhost:5100/cursos/api/cursos',    // Cursos
  noticiasEventosUrl: 'http://localhost:5100/noticias/api',   // NoticiasEventos
  estudiantesUrl: 'http://localhost:5100/estudiantes/api',       // Estudiantes (base, servicio añade /estudiantes/{id})
  pedidosUrl: 'http://localhost:5100/pedidos/api',           // Pedidos
  carrerasUrl: 'http://localhost:5100/carreras/api/carreras', // Carreras
  docentesUrl: 'http://localhost:5100/docentes/api',          // Docentes
  evaluacionesUrl: 'http://localhost:5100/evaluaciones/api',      // Evaluaciones
  // Frontend Portal (localhost para desarrollo)
  portalUrl: 'http://localhost:4201/login'
};
