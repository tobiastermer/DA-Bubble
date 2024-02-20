import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: Auth, private firestore: Firestore, private router: Router) { }
  
  

  async saveAccountDataUser(email: string, password: string, name: string, avatarPath: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.afAuth, email, password);
      const user = userCredential.user;

      if (user) {
        
        await sendEmailVerification(user);

      
        const avatarNumber = parseInt(avatarPath.split('/').pop()?.split('.')[0] ?? '0', 10);
  
        await addDoc(collection(this.firestore, "users"), {
          uid: user.uid,
          name: name,
          email: email,
          avatar: avatarNumber, 
          status: ""
        });
      }
    } catch (error) {
      console.error('Registrierungsfehler', error); // muss noch drin bleiben wegen fetchemail Problem.
      throw error; 
    }
  }
}
