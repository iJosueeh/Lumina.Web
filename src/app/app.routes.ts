import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard.js';
import { roleGuard } from './core/auth/guards/role-guard.js';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'admin',
        loadComponent: () =>
            import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./shared/components/unauthorized/unauthorized.js').then(m => m.Unauthorized)
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];