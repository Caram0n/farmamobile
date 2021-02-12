import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Orden } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDbService {

  constructor(public asf: AngularFirestore, public auth: AuthService) { }

  createDocument<tipo>(data: tipo, enlace: string, id: string) {
    const ref = this.asf.collection<tipo>(enlace);
    return ref.doc(id).set(data)
  }

  getCollection<tipo>(enlace: string): Observable<tipo[]> {
    const ref = this.asf.collection<tipo>(enlace);
    return ref.valueChanges();

  }

  deleteDocument<tipo>(enlace: string, id: string){
    const ref = this.asf.collection<tipo>(enlace);
    return ref.doc(id).delete();
  }

  createId(){
    return this.asf.createId();
  }

  getDocument<tipo>(enlace: string, id: string){
    const ref = this.asf.collection<tipo>(enlace);
    return ref.doc(id).valueChanges();
  }


  updateDocument(data: any, enlace: string, id: string){
    const ref = this.asf.collection(enlace);
    return ref.doc(id).update(data);
  }

  getCollectionQuery<tipo>(enlace: string, parametro: string, condicion: any, busqueda: string){
    const collection = this.asf.collection<tipo>(enlace,
      ref => ref.where( parametro, condicion, busqueda));
      return collection.valueChanges();
  }


  getCollectionSort<tipo>(enlace: string, parametro: string, orden: Orden){
    const collection = this.asf.collection<tipo>(enlace,
      ref => ref.orderBy(parametro, orden));
      return collection.valueChanges();
  }


  
}
