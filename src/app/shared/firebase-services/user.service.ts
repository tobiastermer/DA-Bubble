import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class'
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    users: User[] = [];
    subscribeAllUsers;
    subscribeSingleUser?: () => void;
    firestore: Firestore = inject(Firestore);
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser = this.currentUserSubject.asObservable();

    constructor() {
        this.subscribeAllUsers = this.getAllUsers();
        this.subscribeSingleUser;
    }

    async addUser(item: {}) {
        try {
            const docRef = await addDoc(collection(this.firestore, "users"), item);
            return docRef.id;
            console.log(docRef.id);
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async updateUser(user: User) {
        if (user.id) {
            let docRef = doc(collection(this.firestore, "users"), user.id);
            await updateDoc(docRef, this.getCleanJSON(user)).catch(
                (err) => { console.log(err); }
            )
        }
    }

    getAllUsers() {
        const q = query(collection(this.firestore, 'users'));
        return onSnapshot(q, (list) => {
            this.users = [];
            list.forEach(element => {
                this.users.push(this.setUserObject(element.data(), element.id));
                console.log(this.users);
            });
        });
    }

    getUser(id: string) {
        const userDocRef = doc(this.firestore, "users", id);
        this.subscribeSingleUser = onSnapshot(userDocRef, (documentSnapshot) => {
            if (documentSnapshot.exists()) {
                const user = this.setUserObject(documentSnapshot.data(), documentSnapshot.id);
                // Aktualisieren des currentUserSubject mit dem neuen User-Objekt
                this.currentUserSubject.next(user);
            } else {
                // Handhabung, falls kein User mit der ID gefunden wurde
                console.log(`No user found with id: ${id}`);
                this.currentUserSubject.next(null);
            }
        });
    }

    getCleanJSON(user: User): {} {
        return {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            status: user.status,
        }
    }

    setUserObject(obj: any, id: string): User {
        return {
            id: id,
            name: obj.name || "",
            email: obj.email || "",
            avatar: obj.avatar || 0,
            status: obj.status || "",
        }
    }
}
