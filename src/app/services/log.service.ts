import { Injectable } from '@angular/core';
import { Log } from '../models/interface';
import { FirebaseDbService } from './firebase-db.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    public dbFirebase: FirebaseDbService
  ) { }

  log: Log = {
    user: '',
    fecha: new Date(),
    accion: '',
    id: ''
  }

  addLog(nombre: string, accion: string){
    this.log.user = nombre;
    this.log.fecha = new Date();
    this.log.accion = accion;
    this.log.id = this.dbFirebase.createId();

    this.dbFirebase.createDocument(this.log, 'Log', this.log.id).catch(res => {
      console.log('No se pudo registrar el log ', res);
    });
  }

  addError(accion: string){
    this.log.fecha = new Date();
    this.log.accion = accion;
    this.log.id = this.dbFirebase.createId();

    this.dbFirebase.createDocument(this.log, 'Errores', this.log.id). catch( res => {
      console.log('No se pudo registrar el error ', res);
    })
  }
}
