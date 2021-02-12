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


  addCarrito(){
    this.carritoService.addProducto(this.productoVenta.producto);
  }
  removeCarrito(){
    this.carritoService.removeProducto(this.productoVenta.producto);
  }



}
