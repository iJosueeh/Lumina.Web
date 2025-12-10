export interface PedidoItemCommand {
  cursoId: string;
}

export interface CrearPedidoCommand {
  clienteId: string;
  items: PedidoItemCommand[];
}