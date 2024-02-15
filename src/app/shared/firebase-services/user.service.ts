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
    users: User[] = [];
    subscribeAllUsers;
    firestore: Firestore = inject(Firestore);

    constructor() {
        this.subscribeAllUsers = this.getAllUsers();
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
            let docRef = doc(collection(this.firestore, 'users'), user.id);
            await updateDoc(docRef, this.getCleanJSON(user)).catch(
                (err) => { console.log(err); }
            )
        }
    }

    getAllUsers() {
        const q = query(collection(this.firestore, 'users'));
        return onSnapshot(q, (list) => {
            const users: User[] = [];
            list.forEach(element => {
                users.push(this.setUserObject(element.data(), element.id));
            });
            this.usersSubject.next(users); // Aktualisiere das BehaviorSubject
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
