# Lumina Core - Plataforma Académica 🎓

¡Bienvenido al repositorio del Frontend de **Lumina Core**! Esta es una aplicación web moderna diseñada para la gestión académica, integrando estudiantes, docentes y administrativos en un ecosistema digital eficiente.

Este proyecto representa la **Fase 1 (Web Principal Pública)**, construida con las últimas tecnologías web y consumiendo una arquitectura de microservicios distribuida.

---

## ✨ Características Principales (Fase 1 Completada)

*   **Arquitectura Moderna:** Single Page Application (SPA) optimizada.
*   **Diseño Premium UI/UX:** Interfaz limpia y profesional construida con **Tailwind CSS**.
*   **🌓 Dark Mode Nativo:** Soporte completo para modo oscuro con detección automática y persistencia.
*   **Gestión de Estado Reactiva:** Uso de **Angular Signals** para un manejo de datos eficiente.
*   **Contenido Dinámico:** Integración real con microservicios para Cursos, Carreras, Noticias y Eventos.
*   **Módulos Implementados:**
    *   🏠 **Home:** Landing page con programas destacados dinámicos.
    *   📚 **Cursos y Carreras:** Catálogo completo con filtrado y detalles profundos.
    *   📰 **Noticias y Eventos:** Sistema de novedades con categorías.
    *   📝 **Admisión:** Flujo de información para postulantes.
    *   🏢 **Institucional:** Páginas de "Sobre Nosotros", "Vida Lumina" y "Contacto".

---

## 🛠️ Stack Tecnológico

Este frontend ha sido construido utilizando estándares modernos de desarrollo:

*   **Core:** [Angular 18+](https://angular.dev/) (Standalone Components).
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (Tipado estricto).
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first framework).
*   **Iconografía:** Heroicons & FontAwesome.
*   **Gestión de Paquetes:** npm.

### Integración Backend (Microservicios)
El frontend consume múltiples APIs REST desarrolladas en **.NET Core**:
*   📡 **Microservicio de Usuarios y Seguridad** (Auth JWT).
*   📡 **Microservicio de Cursos y Matrículas**.
*   📡 **Microservicio de Noticias y Eventos**.

---

## 🚀 Próximos Pasos (Fase 2 - En Desarrollo)

El proyecto evoluciona hacia una suite educativa completa. El trabajo continúa en repositorios dedicados para los portales de gestión:

*   **🔐 Portales Autenticados:**
    *   **Portal del Estudiante:** Visualización de notas, entrega de tareas, matrícula.
    *   **Portal del Docente:** Gestión de cursos, calificación, asistencia.
    *   **Portal Administrativo:** Dashboard de métricas, gestión de usuarios y roles.
*   **Funcionalidades Avanzadas:**
    *   Sistema de pagos online.
    *   Foros y comunicación en tiempo real.

---

## 🏁 Configuración Local

Si deseas correr este proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/lumina-core-frontend.git
    cd lumina-core-frontend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Entorno:**
    Asegúrate de tener los microservicios corriendo o actualiza `src/environments/environment.ts` con tus endpoints.

4.  **Ejecutar:**
    ```bash
    ng serve
    ```
    Visita `http://localhost:4200/`.

---

> Propiedad de **Lumina.Core**. Desarrollado con ❤️ y mucho código.