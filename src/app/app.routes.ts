import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';
import { roleGuard } from './core/auth/guards/role-guard';

export const routes: Routes = [
    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register/register').then(m => m.Register)
    },
    {
        path: 'registro',
        loadComponent: () =>
            import('./features/auth/register-enrollment/register-enrollment.component').then(m => m.RegisterEnrollmentComponent),
        title: 'Registro y Matrícula - Lumina'
    },
    {
        path: 'admision/aplicar',
        loadComponent: () =>
            import('./features/auth/register-enrollment/register-enrollment.component').then(m => m.RegisterEnrollmentComponent),
        title: 'Aplicar a Carrera - Lumina'
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./features/home/home').then(m => m.Home),
        title: 'Inicio - Lumina'
    },
    {
        path: 'noticias-eventos',
        loadComponent: () =>
            import('./features/noticias-eventos/noticias-eventos').then(m => m.NoticiasEventos),
        title: 'Noticias y Eventos - Lumina'
    },
    {
        path: 'noticias/:id',
        loadComponent: () =>
            import('./features/noticias-eventos/noticia-detalle/noticia-detalle').then(m => m.NoticiaDetalleComponent),
        title: 'Noticia - Lumina'
    },
    {
        path: 'cursos',
        loadComponent: () =>
            import('./features/cursos/course-list/course-list').then(m => m.CourseList),
        title: 'Cursos - Lumina'
    },
    {
        path: 'cursos/matricula/:id',
        loadComponent: () =>
            import('./features/cursos/course-enrollment/course-enrollment').then(m => m.CourseEnrollment),
        title: 'Matrícula - Lumina'
    },
    {
        path: 'cursos/:id',
        loadComponent: () =>
            import('./features/cursos/course-detail/course-detail').then(m => m.CourseDetail),
        title: 'Detalle del Curso - Lumina'
    },
    {
        path: 'sobre-nosotros',
        loadComponent: () =>
            import('./features/sobre-nosotros/sobre-nosotros').then(m => m.SobreNosotros),
        title: 'Sobre Nosotros - Lumina'
    },
    {
        path: 'contacto',
        loadComponent: () =>
            import('./features/contacto/contacto').then(m => m.Contacto),
        title: 'Contacto - Lumina'
    },
    {
        path: 'estudiante',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['STUDENT'] },
        children: [
            {
                path: '',
                redirectTo: 'cursos',
                pathMatch: 'full'
            },
            {
                path: 'cursos',
                loadComponent: () =>
                    import('./features/estudiante/my-courses/my-courses').then(m => m.MyCourses),
                title: 'Mis Cursos - Estudiante'
            }
        ]
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./shared/components/unauthorized/unauthorized').then(m => m.Unauthorized)
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];