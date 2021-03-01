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
    rol: Rol;
}

export interface Familia {
    codigo: string;
    descripcion: string;
    impuesto: number;
    ganancia: number;
}

export interface Venta {
    id: string;
    productos: ProductoVenta [];
    precioTotal: number;
    fecha: Date;
}

export interface ProductoVenta {
    producto: Producto;
    cantidad: number;
}

export interface Caja {
    id: string;
    pedido: Venta [];
    totalCaja: number;
}

export interface Proveedor {
    cif: string;
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
}

export interface PedidoProveedores{
    id: string;
    productosP: ProductoProveedor[];
    precioTotal: number;
    fecha: Date;
}

export interface ProductoProveedor {
    producto: Producto;
    cantidad: number;
}

export interface Log {
    id: string;
    user: string;
    fecha: Date;
    accion: string;
}

export type Orden = 'asc' | 'desc' ;

export type Rol = 'Administrador' | 'Farmacéutico' | 'Técnico';


