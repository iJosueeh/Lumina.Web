import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'lumina-theme';

    // Signal para reactividad
    theme = signal<Theme>(this.getInitialTheme());

    constructor() {
        // Aplicar tema al cargar
        effect(() => {
            this.applyTheme(this.theme());
        });
    }

    private getInitialTheme(): Theme {
        // 1. Verificar localStorage
        const stored = localStorage.getItem(this.THEME_KEY) as Theme;
        if (stored) return stored;

        // 2. Verificar preferencia del sistema
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    toggleTheme(): void {
        this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    }

    setTheme(theme: Theme): void {
        this.theme.set(theme);
    }

    private applyTheme(theme: Theme): void {
        const html = document.documentElement;

        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        // Guardar en localStorage
        localStorage.setItem(this.THEME_KEY, theme);
    }
}
