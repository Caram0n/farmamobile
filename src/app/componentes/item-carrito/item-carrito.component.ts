import { Component, Input, OnInit } from '@angular/core';
import { ProductoVenta } from '../../models/interface';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-item-carrito',
  templateUrl: './item-carrito.component.html',
  styleUrls: ['./item-carrito.component.scss'],
})
export class ItemCarritoComponent implements OnInit {
  @Input() productoVenta: ProductoVenta;

  constructor(public carritoService: CarritoService) { }

  ngOnInit() {}

  // LLama a una funcion del servicio para añadir un producto a la venta
  addCarrito(){
    this.carritoService.addProducto(this.productoVenta.producto);
  }
  // LLama a una funcion del servicio para eliminar un producto a la venta
  removeCarrito(){
    this.carritoService.removeProducto(this.productoVenta.producto);
  }



}
