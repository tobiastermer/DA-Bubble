import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  Storage,
} from '@angular/fire/storage';
import { doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';//

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }


  /**
  * Checks if a user with the given UID exists in the Firestore database.
  * @param {string} uid - The UID of the user to check.
  * @returns {Promise<boolean>} A promise that resolves to true if the user exists, false otherwise.
  */
  async userExists(uid: string): Promise<boolean> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists();
  }


  /**
   * Checks if an email address exists in the Firestore database.
   * @param {string} email - The email address to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the email exists, false otherwise.
   */
  async emailExists(email: string): Promise<boolean> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }


  /**
   * Saves account data for a user in Firestore and creates a new account using email and password authentication.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @param {string} name - The name of the user.
   * @param {string} avatarPath - The path to the user's avatar image.
   */
  async saveAccountDataUser(
    email: string,
    password: string,
    name: string,
    avatarPath: string
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.afAuth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        await sendEmailVerification(user);
        await addDoc(collection(this.firestore, 'users'), {
          uid: user.uid,
          name: name,
          email: email,
          avatar: avatarPath,
          status: '',
        });
      }
    } catch (error) {
      throw error;
    }
  }


  /**
   * Signs in a user using Google authentication and saves user data to Firestore.
   * @returns {Promise<any>} A promise that resolves to the signed-in user.
   */
  async signInWithGoogle(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.afAuth, provider);
      const user = userCredential.user;
      await this.saveUserData(user);
      return user;
    } catch (error) {
      throw error;
    }
  }


  /**
   * Saves user data to Firestore.
   * @param {any} user - The user object containing data to be saved.
   */
  async saveUserData(user: any) {
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(
      userDocRef,
      {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        status: '',
      },
      { merge: true }
    );
  }


  /**
   * Uploads an avatar image file to Cloud Storage.
   * @param {File} file - The avatar image file to upload.
   * @returns {Promise<string>} A promise that resolves to the download URL of the uploaded image.
   */
  async uploadAvatarImage(file: File): Promise<string> {
    const storageRef = ref(this.storage, `avatars/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }


  /**
   * Uploads a message data file to Cloud Storage.
   * @param {File} file - The message data file to upload.
   * @returns {Promise<string>} A promise that resolves to the download URL of the uploaded file.
   */
  async uploadMsgData(file: File): Promise<string> {
    const storageRef = ref(
      this.storage,
      `message_data/${Date.now()}_${file.name}`
    );
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }


  /**
   * Updates the email address of a user in Firestore if needed.
   * @param {string} uid - The UID of the user whose email is to be updated.
   * @param {string} newEmail - The new email address.
   */
  async updateEmailInFirestoreIfNeeded(uid: string, newEmail: string) {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      const userData = querySnapshot.docs[0].data();

      if (userData['email'] !== newEmail) {
        await setDoc(userDocRef, { email: newEmail }, { merge: true });
      }
    }
  }
  
}
