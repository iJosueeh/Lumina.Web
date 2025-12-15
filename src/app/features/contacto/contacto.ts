import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactInfo } from '@app/core/models/contact-info';

interface RedSocial {
  nombre: string;
  url: string;
  icono: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto implements OnInit {
  contactForm: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  contactInfo: ContactInfo[] = [
    {
      icono: 'phone',
      titulo: 'Teléfono',
      valor: '(01) 555-0199',
      link: 'tel:015550199'
    },
    {
      icono: 'email',
      titulo: 'Email',
      valor: 'admision@lumina.com',
      link: 'mailto:admision@lumina.com'
    },
    {
      icono: 'clock',
      titulo: 'Horario de Atención',
      valor: 'L-V: 8am - 6pm'
    },
    {
      icono: 'location',
      titulo: 'Sede Central',
      valor: 'Av. Tecnológica 123'
    }
  ];

  temasAsunto = [
    'Información General',
    'Proceso de Admisión',
    'Programas y Cursos',
    'Costos y Becas',
    'Soporte Técnico',
    'Otro'
  ];

  redesSociales: RedSocial[] = [
    { nombre: 'Facebook', url: 'https://facebook.com', icono: 'facebook' },
    { nombre: 'Twitter', url: 'https://twitter.com', icono: 'twitter' },
    { nombre: 'LinkedIn', url: 'https://linkedin.com', icono: 'linkedin' }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.successMessage = '¡Mensaje enviado con éxito! Te responderemos lo antes posible.';
      this.contactForm.reset();
      this.submitted = false;

      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }, 1500);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get nombreCompleto() {
    return this.contactForm.get('nombreCompleto');
  }

  get correoElectronico() {
    return this.contactForm.get('correoElectronico');
  }

  get asunto() {
    return this.contactForm.get('asunto');
  }

  get mensaje() {
    return this.contactForm.get('mensaje');
  }

}