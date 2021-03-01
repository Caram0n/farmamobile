import { Injectable } from '@angular/core';
import { Caja, Venta } from '../models/interface';
import { Subject, Subscription, Observable } from 'rxjs';
import { FirebaseDbService } from './firebase-db.service';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  
  private caja: Caja;
  caja$ = new Subject<Caja>();
  path = 'Cajas'
  fechaCaja: string = '';

  cajaSubscriber: Subscription;

  constructor(
    public dbFirebase: FirebaseDbService,
  ) { 
    this.getFechaCaja();
    this.loadCaja();
    
  }

  initCaja(){
    this.caja ={
      id: '',
      pedido: [],
      totalCaja: null
    }
    this.caja$.next(this.caja);
  }

  loadCaja(){
    if(this.cajaSubscriber){
      this.cajaSubscriber.unsubscribe();
    }
    this.cajaSubscriber = this.dbFirebase.getDocument<Caja>(this.path, this.fechaCaja).subscribe(res => {
      console.log(res);
      if(res){
        this.caja = res;
        this.caja$.next(this.caja);
      }else{
        this.initCaja();
      }
    });
  }
  getCaja(): Observable<Caja> {
    setTimeout(() => {
      this.caja$.next(this.caja);
    },100);
    return this.caja$.asObservable();
  }

  addVenta(ventaInput: Venta){
    const add: Venta = ventaInput;
    this.caja.id=this.fechaCaja;
    this.caja.pedido.push(add);
    this.caja.totalCaja =  this.caja.totalCaja + ventaInput.precioTotal;
    this.caja$.next(this.caja);    

    this.dbFirebase.createDocument(this.caja, this.path, this.fechaCaja). then(() =>{
      console.log('guardado con éxito')
    });

    }
  

  getFechaCaja(){
    const fecha = new Date().toISOString();
    this.fechaCaja= fecha.substr(0,10);
  }
}
