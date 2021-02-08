export interface Producto {

    codigo: string;
    descripcion: string;
    precio_Alb: number;
    impuestos: number;
    pvp: number,
    stock: number;
    familia: string;
    fecha_cad: string;
    sinonimo: string;
    foto: string;

}


export interface Usuario {
    uid: string;
    nombre: string;
    email: string;
    movil: string;
    dni: string;
    password: string;
    rol: string;
}


export interface Familia {
    codigo: string;
    descripcion: string;
    impuesto: number;
}

export interface Pedido {
    id: string;
    productos: ProductoPedido [];
    precioTotal: number;
    fecha: Date;
}

export interface ProductoPedido {
    producto: Producto;
    cantidad: number;
}

export interface Caja {
    id: string;
    pedido: Pedido [];
    totalCaja: number;
}

export interface Proveedor {
    cif: string;
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
}


