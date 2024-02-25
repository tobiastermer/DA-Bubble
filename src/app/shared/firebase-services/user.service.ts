import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class'
import { BehaviorSubject } from 'rxjs';
import { getDocs } from 'firebase/firestore';
import { DataService } from '../services/data.service';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private usersSubject = new BehaviorSubject<User[]>([]);
    public users$ = this.usersSubject.asObservable();
    firestore: Firestore = inject(Firestore);

    constructor(
        private dataService: DataService
    ) {
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

    async deleteUser(user: User) {
        await deleteDoc(doc(collection(this.firestore, 'users'), user.id)).catch(
            (err) => { console.log(err); }
        )
    }

    getAllUsers() {
        const q = query(collection(this.firestore, 'users'), orderBy('name'));
        onSnapshot(q, (snapshot) => {
            let users = snapshot.docs.map(doc => User.fromFirestore({ id: doc.id, data: () => doc.data() }));
            if (this.dataService.currentUser && this.dataService.currentUser.id) {
                const currentUserIndex = users.findIndex(user => user.id === this.dataService.currentUser.id);
                if (currentUserIndex > -1) {
                    const currentUser = users.splice(currentUserIndex, 1)[0];
                    users = [currentUser, ...users.sort((a, b) => a.name.localeCompare(b.name))];
                }
            } else {
                users.sort((a, b) => a.name.localeCompare(b.name));
            }
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

    async getUserByAuthUid(authUid: string): Promise<User | null> {
        if (!authUid) {
            console.error("authUid ist undefined.");
            return null;
        }
        try {
            const usersRef = collection(this.firestore, 'users');
            const q = query(usersRef, where("uid", "==", authUid), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                return new User({
                    id: docSnap.id,
                    ...docSnap.data()
                });
            } else {
                console.log('Kein Usier in der Auth');
                return null;
            }
        } catch (error) {
            console.error("fehler beim abrufen der Auth", error);
            return null;
        }
    }

    async updateUserStatusByUid(uid: string, status: string): Promise<void> {
        const usersRef = collection(this.firestore, "users");
        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
            await updateDoc(userDocRef, { status: status });

        } else {

        }
    }
}
