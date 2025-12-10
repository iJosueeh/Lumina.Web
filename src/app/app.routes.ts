import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';
import { roleGuard } from './core/auth/guards/role-guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register/register').then(m => m.Register)
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
        path: 'cursos',
        loadComponent: () =>
            import('./features/cursos/course-list/course-list').then(m => m.CourseList),
        title: 'Cursos - Lumina'
    },
    {
        path: 'cursos/:id',
        loadComponent: () =>
            import('./features/cursos/course-detail/course-detail').then(m => m.CourseDetail),
        title: 'Detalle del Curso - Lumina'
    },
    {
        path: 'carrito',
        loadComponent: () => import('./features/carrito/carrito').then(m => m.CarritoComponent),
        title: 'Carrito de Compras - Lumina'
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout),
        title: 'Checkout - Lumina'
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