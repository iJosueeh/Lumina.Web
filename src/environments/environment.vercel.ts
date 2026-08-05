// Path: Lumina.Web/src/environments/environment.vercel.ts
/**
 * Environment configuration for Vercel deployment.
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
  carrerasUrl: '/api/carreras',
  portalUrl: 'https://lumina-core-portal.vercel.app/login',
};
