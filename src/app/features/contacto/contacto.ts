import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactInfo } from '@app/core/models/contact-info';

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
      icono: 'email',
      titulo: 'Email',
      valor: 'contacto@academiapro.com',
      link: 'mailto:contacto@academiapro.com'
    },
    {
      icono: 'phone',
      titulo: 'Teléfono',
      valor: '+34 912 345 678',
      link: 'tel:+34912345678'
    },
    {
      icono: 'location',
      titulo: 'Dirección',
      valor: 'Calle de la Innovación, 123\n28080, Madrid, España'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
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