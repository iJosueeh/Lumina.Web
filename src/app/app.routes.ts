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
        title: 'Inicio - AcademiaPro'
    },
    {
        path: 'cursos',
        loadComponent: () =>
            import('./features/cursos/course-list/course-list').then(m => m.CourseList),
        title: 'Cursos - AcademiaPro'
    },
    {
        path: 'cursos/:id',
        loadComponent: () =>
            import('./features/cursos/course-detail/course-detail').then(m => m.CourseDetail),
        title: 'Detalle del Curso - AcademiaPro'
    },
    {
        path: 'sobre-nosotros',
        loadComponent: () =>
            import('./features/sobre-nosotros/sobre-nosotros').then(m => m.SobreNosotros),
        title: 'Sobre Nosotros - AcademiaPro'
    },
    {
        path: 'contacto',
        loadComponent: () =>
            import('./features/contacto/contacto').then(m => m.Contacto),
        title: 'Contacto - AcademiaPro'
    },
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'user-management',
                loadComponent: () =>
                    import('./features/admin/user-management/user-management').then(m => m.UserManagement)
            }
        ]
    },
    {
        path: 'profesional',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['PROFESSIONAL'] },
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/profesional/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'material-management',
                loadComponent: () =>
                    import('./features/profesional/course-management/course-management').then(m => m.CourseManagement) // Adjusted to use course-management as material management
            },
            {
                path: 'perfil',
                loadComponent: () =>
                    import('./features/profesional/profesional').then(m => m.Profesional)
            },
        ]
    },
    {
        path: 'estudiante',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ESTUDIANTE'] },
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/estudiante/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'my-courses',
                loadComponent: () =>
                    import('./features/estudiante/my-courses/my-courses').then(m => m.MyCourses)
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