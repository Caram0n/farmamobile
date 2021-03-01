import { Component, Input, OnInit } from '@angular/core';
import { ProductoProveedor } from '../../models/interface';
import { PedidoProveedorService } from '../../services/pedido-proveedor.service';

@Component({
  selector: 'app-item-pedido',
  templateUrl: './item-pedido.component.html',
  styleUrls: ['./item-pedido.component.scss'],
})
export class ItemPedidoComponent implements OnInit {

  @Input() productoPedido: ProductoProveedor;

  constructor(public pedidoProveedorService: PedidoProveedorService) { }

  ngOnInit() {}

  // LLama a una funcion del servicio para añadir un producto al pedido en curso
  addItem(){
    this.pedidoProveedorService.addProductoPedido(this.productoPedido.producto);
  }
  // LLama a una funcion del servicio para añadir un producto al pedido en curso
  removeItem(){
    this.pedidoProveedorService.removeProductoPedido(this.productoPedido.producto);
  }

}
