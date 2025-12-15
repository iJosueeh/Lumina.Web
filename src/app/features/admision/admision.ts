import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PASOS_ADMISION, EVENTOS_CALENDARIO, PREGUNTAS_FAQ } from './data/admision-data';
import { CarreraService } from '@app/features/carreras/services/carrera.service';

type TabType = 'proceso' | 'fechas' | 'faq' | 'contacto';

@Component({
    selector: 'app-admision',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './admision.html',
})
export class Admision implements OnInit {
    private fb = inject(FormBuilder);
    private carreraService = inject(CarreraService);

    activeTab: TabType = 'proceso';

    // Data
    pasos = PASOS_ADMISION;
    eventos = EVENTOS_CALENDARIO;
    preguntas = PREGUNTAS_FAQ;

    // FAQ state
    expandedFaqIndex: number | null = null;

    // Contact form
    contactForm: FormGroup;
    formSubmitted = false;
    formError = false;
    programas: string[] = ['Cargando...'];

    ngOnInit(): void {
        this.loadProgramas();
    }

    constructor() {
        this.contactForm = this.fb.group({
            nombreCompleto: ['', Validators.required],
            correoElectronico: ['', [Validators.required, Validators.email]],
            programaInteres: ['', Validators.required]
        });
    }

    loadProgramas(): void {
        this.carreraService.getAllCarreras().subscribe({
            next: (carreras) => {
                this.programas = carreras.map(c => c.nombre);
                // Set first program as default
                if (this.programas.length > 0) {
                    this.contactForm.patchValue({ programaInteres: this.programas[0] });
                }
            },
            error: (error) => {
                console.error('Error loading programas:', error);
                this.programas = ['Desarrollo Web Full-Stack', 'Ciencia de Datos', 'Ciberseguridad'];
                this.contactForm.patchValue({ programaInteres: this.programas[0] });
            }
        });
    }

    setActiveTab(tab: TabType): void {
        this.activeTab = tab;
    }

    toggleFaq(index: number): void {
        this.expandedFaqIndex = this.expandedFaqIndex === index ? null : index;
    }

    onSubmitContactForm(): void {
        if (this.contactForm.valid) {
            // Simulate sending to backend
            console.log('Solicitud de información:', this.contactForm.value);
            this.formSubmitted = true;
            this.formError = false;

            // Reset form after 5 seconds
            setTimeout(() => {
                this.contactForm.reset();
                if (this.programas.length > 0 && this.programas[0] !== 'Cargando...') {
                    this.contactForm.patchValue({ programaInteres: this.programas[0] });
                }
                this.formSubmitted = false;
            }, 5000);
        } else {
            // Mark all fields as touched to show validation errors
            Object.keys(this.contactForm.controls).forEach(key => {
                this.contactForm.get(key)?.markAsTouched();
            });
            this.formError = true;
        }
    }

    scrollToForm(): void {
        this.setActiveTab('contacto');
        setTimeout(() => {
            const formElement = document.getElementById('contact-form');
            formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}
