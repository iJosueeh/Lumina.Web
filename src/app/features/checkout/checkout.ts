import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '@app/core/auth/services/auth';
import { CourseDetalles } from '@app/core/models/course-detalles';
import { CarritoService } from '../estudiante/services/carrito.service';
import { CursoService } from '../cursos/services/curso.service';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PedidosService } from '@app/core/services/pedidos.service';
import { CrearPedidoCommand, PedidoItemCommand } from '@app/core/models/pedido.model';

@Component({
    selector: 'app-checkout',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
    private authService = inject(Auth);
    private carritoService = inject(CarritoService);
    private cursoService = inject(CursoService);
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private pedidosService = inject(PedidosService); // Inyectar PedidosService

    cartItems: CourseDetalles[] = [];
    totalPrice = 0;
    loading = true;
    processing = false;
    selectedPaymentMethod: 'card' | 'paypal' | 'bank' = 'card';

    paymentForm!: FormGroup;

    ngOnInit(): void {
        this.initializeForm();
        this.loadCartDetails();
    }

    initializeForm(): void {
        this.paymentForm = this.fb.group({
            cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
            cardHolder: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
            expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
            cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
            country: ['', Validators.required],
            postalCode: ['']
        });
    }

    loadCartDetails(): void {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            this.router.navigate(['/login']);
            return;
        }

        this.carritoService.verCarrito(currentUser.id).pipe(
            switchMap(carrito => {
                if (carrito.cursoIds && carrito.cursoIds.length > 0) {
                    const courseObservables: Observable<CourseDetalles>[] = carrito.cursoIds.map(id =>
                        this.cursoService.getCourseById(id)
                    );
                    return forkJoin(courseObservables);
                }
                return new Observable<CourseDetalles[]>(subscriber => subscriber.next([]));
            })
        ).subscribe({
            next: (courses) => {
                this.cartItems = courses;
                this.calculateTotal();
                this.loading = false;

                // Si el carrito está vacío, redirigir
                if (this.cartItems.length === 0) {
                    this.router.navigate(['/carrito']);
                }
            },
            error: () => {
                // El interceptor global ya maneja el error
                this.loading = false;
                this.cartItems = [];
                this.router.navigate(['/carrito']);
            }
        });
    }

    calculateTotal(): void {
        this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.precio, 0);
    }

    selectPaymentMethod(method: 'card' | 'paypal' | 'bank'): void {
        this.selectedPaymentMethod = method;
    }

    formatCardNumber(event: any): void {
        let value = event.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        this.paymentForm.patchValue({ cardNumber: formattedValue.replace(/\s/g, '') });
        event.target.value = formattedValue;
    }

    formatExpiryDate(event: any): void {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        event.target.value = value;
        this.paymentForm.patchValue({ expiryDate: value });
    }

    processPayment(): void {
        if (this.paymentForm.invalid && this.selectedPaymentMethod === 'card') {
            Object.keys(this.paymentForm.controls).forEach(key => {
                this.paymentForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.processing = true;

        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            this.router.navigate(['/login']);
            this.processing = false;
            return;
        }

        const pedidoItems: PedidoItemCommand[] = this.cartItems.map(item => ({
            cursoId: item.id
        }));

        const crearPedidoCommand: CrearPedidoCommand = {
            clienteId: currentUser.id,
            items: pedidoItems
        };

        this.pedidosService.crearPedido(crearPedidoCommand).subscribe({
            next: (orderId: string) => {
                // Clear the cart after successful order creation
                this.carritoService.vaciarCarrito(currentUser.id).subscribe({
                    next: () => {
                        this.carritoService.updateCartItemCount(0); // Update cart count in Navbar
                        const orderData = {
                            items: this.cartItems,
                            total: this.totalPrice,
                            paymentMethod: this.selectedPaymentMethod,
                            orderDate: new Date().toISOString(),
                            orderId: orderId // Use the actual orderId from the backend
                        };
                        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
                        this.router.navigate(['/checkout/confirmacion']);
                    },
                    error: (err) => {
                        console.error('Error al vaciar el carrito:', err);
                        // Even if clearing the cart fails, we might still want to go to confirmation
                        // or handle this error separately. For now, redirecting to confirmation.
                        const orderData = {
                            items: this.cartItems,
                            total: this.totalPrice,
                            paymentMethod: this.selectedPaymentMethod,
                            orderDate: new Date().toISOString(),
                            orderId: orderId // Use the actual orderId from the backend
                        };
                        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
                        this.router.navigate(['/checkout/confirmacion']);
                    }
                });
            },
            error: (err) => {
                console.error('Error al crear el pedido:', err);
                this.processing = false;
                // Handle error (e.g., show a toast message to the user)
            }
        });
    }

    private generateOrderId(): string {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    getFieldError(fieldName: string): string {
        const field = this.paymentForm.get(fieldName);
        if (field?.hasError('required')) {
            return 'Este campo es requerido';
        }
        if (field?.hasError('pattern')) {
            switch (fieldName) {
                case 'cardNumber':
                    return 'Número de tarjeta inválido (16 dígitos)';
                case 'cardHolder':
                    return 'Solo se permiten letras';
                case 'expiryDate':
                    return 'Formato: MM/YY';
                case 'cvv':
                    return 'CVV inválido (3-4 dígitos)';
                default:
                    return 'Formato inválido';
            }
        }
        return '';
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.paymentForm.get(fieldName);
        return !!(field?.invalid && field?.touched);
    }

    isFieldValid(fieldName: string): boolean {
        const field = this.paymentForm.get(fieldName);
        return !!(field?.valid && field?.touched);
    }
}
