import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class'
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private usersSubject = new BehaviorSubject<User[]>([]);
    public users$ = this.usersSubject.asObservable();
    firestore: Firestore = inject(Firestore);

    constructor() {
        this.getAllUsers();
    }

    async addUser(user: User) {
        try {
            const docRef = await addDoc(collection(this.firestore, "users"), user.toJSON());
            console.log(docRef.id);
            return docRef.id;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async updateUser(user: User) {
        if (user.id) {
            const docRef = doc(collection(this.firestore, 'users'), user.id);
            await updateDoc(docRef, user.toJSON()).catch(console.error);
        }
    }

    getAllUsers() {
        const q = query(collection(this.firestore, 'users'));
        onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => User.fromFirestore({ id: doc.id, data: () => doc.data() }));
            this.usersSubject.next(users);
        });
    }

    async getUserByID(userID: string): Promise<User | null> {
        try {
            const docRef = doc(this.firestore, 'users', userID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const user = new User({
                    id: docSnap.id,
                    ...docSnap.data()
                });
                return user;
            } else {
                console.log('No such user doc!');
                return null;
            }
        } catch (error) {
            console.error("Error getting user doc:", error);
            return null;
        }
    }
}