import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CrearPedidoCommand } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = `${environment.pedidosUrl}/pedidos`;

  constructor(private http: HttpClient) { }

  crearPedido(command: CrearPedidoCommand): Observable<string> {
    return this.http.post<string>(this.apiUrl, command);
  }
}
