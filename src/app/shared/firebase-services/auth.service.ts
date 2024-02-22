import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { ref, uploadBytes, getDownloadURL, Storage } from '@angular/fire/storage'; // Import für Storage
import { doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: Auth, private firestore: Firestore, private router: Router, private storage: Storage) {}
  

  async userExists(uid: string): Promise<boolean> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists();
  }

  async emailExists(email: string): Promise<boolean> {
    const usersRef = collection(this.firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
  

  async saveAccountDataUser(email: string, password: string, name: string, avatarPath: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.afAuth, email, password);
      const user = userCredential.user;

      if (user) {
        
        await sendEmailVerification(user);

      
  
        await addDoc(collection(this.firestore, "users"), {
          uid: user.uid,
          name: name,
          email: email,
          avatar: avatarPath, 
          status: ""
        });
      }
    } catch (error) {
      console.error('Registrierungsfehler', error); // muss noch drin bleiben wegen fetchemail Problem.
      throw error; 
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.afAuth, provider);
      const user = userCredential.user;

     
      await this.saveUserData(user);

      return user;
    } catch (error) {
      console.error('Fehler bei der Anmeldung mit Google', error);
      throw error;
    }
  }
  
  async saveUserData(user: any) {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL,  
      status: ""
    }, { merge: true }); 
  }


  async uploadAvatarImage(file: File): Promise<string> {
    const storageRef = ref(this.storage, `avatars/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
}
