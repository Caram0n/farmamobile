import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
     public asf: AngularFirestore,
     
     ) { 
    this.getUid();
  }


  registerUser(email: string, password: string){
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then((res) => {

    })
    .catch(err => Promise.reject(err));
  }

  loginUser(email: string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    this.afAuth.signOut();
  }

  async getUid(){
    const user = await this.afAuth.currentUser;
    if(user === null){
      return null;
    }else{
      return user.uid;
    }
  }

  stateAuth(){
    return this.afAuth.authState;    
  }


  
}
