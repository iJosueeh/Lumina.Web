// Path: Lumina.Web/src/environments/environment.vercel.ts
/**
 * Environment configuration for Vercel deployment.
 * 
 * Uses relative URLs that will be proxied through Vercel rewrites
 * to the actual microservices backend via API Gateway.
 */
export const environment = {
  production: true,
  
  // Relative URLs - proxied via vercel.json rewrites
  apiUrl: '/api/usuarios',
  coursesUrl: '/api/cursos',
  noticiasEventosUrl: '/api/noticias',
  estudiantesUrl: '/api/estudiantes',
  pedidosUrl: '/api/pedidos',
  carrerasUrl: '/api/carreras',
  docentesUrl: '/api/docentes',
  evaluacionesUrl: '/api/evaluaciones',
  
  // Frontend Portal URL (relative for same-domain)
  portalUrl: '/login',
};
