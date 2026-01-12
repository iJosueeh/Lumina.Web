import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import { Auth } from '@app/core/auth/services/auth';
import { Carrito, CarritoService } from '../estudiante/services/carrito.service';
import { CursoService } from '../cursos/services/curso.service';
import { CourseDetalles } from '@app/core/models/course-detalles';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class CarritoComponent implements OnInit {
  private authService = inject(Auth);
  private carritoService = inject(CarritoService);
  private cursoService = inject(CursoService);

  cartItems: CourseDetalles[] = [];
  totalPrice = 0;
  loading = true;

  ngOnInit(): void {
    this.loadCartDetails();
  }

  loadCartDetails(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.loading = false;
      return;
    }

    this.carritoService.verCarrito(currentUser.id).pipe(
      switchMap(carrito => {
        if (carrito.cursoIds && carrito.cursoIds.length > 0) {
          const courseObservables: Observable<CourseDetalles>[] = carrito.cursoIds.map(id =>
            this.cursoService.getCourseById(id).pipe(
              filter((course): course is CourseDetalles => course !== null)
            )
          );
          return forkJoin(courseObservables);
        }
        return new Observable<CourseDetalles[]>(subscriber => subscriber.next([]));
      })
    ).subscribe(courses => {
      this.cartItems = courses;
      this.calculateTotal();
      this.loading = false;
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.precio, 0);
  }

  removeFromCart(cursoId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.carritoService.eliminarCurso(currentUser.id, cursoId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== cursoId);
      this.calculateTotal();
      this.carritoService.updateCartItemCount(this.cartItems.length);
    });
  }
}
export { Carrito };

