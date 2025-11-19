import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseDetalles } from '@app/core/models/course-detalles';
import { Module } from '@app/core/models/module';

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css',
})
export class CourseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  curso: CourseDetalles | null = null;
  enrollForm: FormGroup;
  loading = false;
  successMessage = '';

  constructor() {
    this.enrollForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correoElectronico: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    const cursoId = this.route.snapshot.paramMap.get('id');
    this.loadCursoData(Number(cursoId));
  }

  loadCursoData(id: number): void {
    this.curso = {
      id: id,
      titulo: 'Curso de Desarrollo Web Avanzado',
      descripcion: 'Domina las tecnologías más demandadas del mercado y lleva tus habilidades al siguiente nivel con nuestro curso práctico e intensivo.',
      duracion: '8 semanas',
      modalidad: 'Online en vivo',
      certificacion: 'Certificado Incluido',
      nivel: 'Intermedio',
      precio: 299,
      precioOriginal: 499,
      imagen: 'https://www.tecsup.edu.pe/wp-content/uploads/2024/04/banner.jpeg',
      instructor: {
        nombre: 'Juan Pérez',
        cargo: 'Ingeniero de Software Senior',
        bio: 'Con más de 10 años de experiencia construyendo aplicaciones escalables para startups y grandes corporaciones, Juan es un apasionado por enseñar y compartir las mejores prácticas de la industria.',
        avatar: 'https://images.unsplash.com/photo-1654110455429-cf322b40a906?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000',
        linkedIn: 'https://linkedin.com/in/juanperez'
      },
      modulos: [
        {
          id: 1,
          titulo: 'Módulo 1: Fundamentos de React',
          descripcion: 'Introducción a los componentes, JSX, props y estado. Creación de una aplicación básica de una sola página para asentar las bases del desarrollo moderno.',
          isExpanded: true,
          lecciones: [
            'Introducción a React y su ecosistema',
            'Componentes funcionales y de clase',
            'Props y State',
            'Hooks básicos: useState y useEffect',
            'Proyecto: Aplicación de tareas'
          ]
        },
        {
          id: 2,
          titulo: 'Módulo 2: Estado Avanzado y Hooks',
          descripcion: 'Profundización en el manejo del estado con Context API, custom hooks y patrones avanzados.',
          isExpanded: false,
          lecciones: [
            'Context API',
            'useReducer y useContext',
            'Custom Hooks',
            'Patrones de composición',
            'Optimización de rendimiento'
          ]
        },
        {
          id: 3,
          titulo: 'Módulo 3: Backend con Node.js y Express',
          descripcion: 'Construcción de APIs RESTful, autenticación y conexión con bases de datos.',
          isExpanded: false,
          lecciones: [
            'Introducción a Node.js',
            'Express y routing',
            'Middleware y manejo de errores',
            'Conexión con MongoDB',
            'Autenticación con JWT'
          ]
        },
        {
          id: 4,
          titulo: 'Módulo 4: Proyecto Final',
          descripcion: 'Desarrollo de una aplicación full-stack completa aplicando todos los conceptos aprendidos.',
          isExpanded: false,
          lecciones: [
            'Planificación del proyecto',
            'Diseño de la arquitectura',
            'Desarrollo del frontend',
            'Desarrollo del backend',
            'Deploy y presentación'
          ]
        }
      ],
      requisitos: [
        'Conocimientos básicos de HTML, CSS y JavaScript (variables, funciones, bucles).',
        'Computadora con acceso a Internet y un editor de código como VS Code.',
        'Ganas de aprender y construir proyectos increíbles.'
      ],
      testimonios: [
        {
          id: 1,
          nombre: 'Carlos Mendoza',
          cargo: 'Desarrollador Frontend',
          testimonio: 'Este curso superó mis expectativas. El contenido es práctico y el docente explica con claridad. ¡Pude aplicar lo aprendido en mi trabajo desde la primera semana!',
          avatar: 'https://img.freepik.com/foto-gratis/chica-cabello-largo-siendo-feliz_23-2148244714.jpg?semt=ais_hybrid&w=740&q=80'
        },
        {
          id: 2,
          nombre: 'Ana García',
          cargo: 'Diseñadora UX/UI',
          testimonio: 'Como diseñadora, quería entender mejor el desarrollo. El curso me dio las herramientas para colaborar más eficazmente con mi equipo. Totalmente recomendado.',
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlwBZHYrWDtR9jrrVLGtA3EAW-r2u3qXZvPg&s'
        }
      ]
    };
  }

  toggleModule(module: Module): void {
    module.isExpanded = !module.isExpanded;
  }

  onEnroll(): void {
    if (this.enrollForm.invalid) {
      this.markFormGroupTouched(this.enrollForm);
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.successMessage = '¡Inscripción exitosa! Te hemos enviado un email con los detalles.';
      this.enrollForm.reset();

      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }, 1500);
  }

  scrollToEnroll(): void {
    const element = document.getElementById('enroll-section');
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get nombreCompleto() {
    return this.enrollForm.get('nombreCompleto');
  }

  get correoElectronico() {
    return this.enrollForm.get('correoElectronico');
  }
}