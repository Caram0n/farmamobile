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


  addItem(){
    this.pedidoProveedorService.addProductoPedido(this.productoPedido.producto);
  }

  removeItem(){
    this.pedidoProveedorService.removeProductoPedido(this.productoPedido.producto);
  }

}
