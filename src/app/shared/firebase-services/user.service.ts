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

    /**
 * Adds a new user to the Firestore database.
 * @param {User} user - The user object to add.
 * @returns {Promise<string>} - A promise that resolves with the new document ID or an error message.
 */
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

    /**
 * Updates an existing user's data in the Firestore database.
 * @param {User} user - The user object with updated data.
 */
    async updateUser(user: User) {
        if (user.id) {
            const docRef = doc(collection(this.firestore, 'users'), user.id);
            await updateDoc(docRef, user.toJSON()).catch(console.error);
        }
    }

    /**
 * Deletes a user from the Firestore database.
 * @param {User} user - The user object to delete.
 */
    async deleteUser(user: User) {
        await deleteDoc(doc(collection(this.firestore, 'users'), user.id)).catch(
            (err) => { console.log(err); }
        )
    }

    /**
 * Retrieves all users from the Firestore database and updates the local users observable.
 */
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
    
/**
 * Retrieves a user by their unique ID from the Firestore database.
 * @param {string} userID - The unique ID of the user to retrieve.
 * @returns {Promise<User | null>} - A promise that resolves with the User object or null if not found.
 */
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

    /**
 * Retrieves a user by their authentication UID from the Firestore database.
 * @param {string} authUid - The authentication UID of the user to retrieve.
 * @returns {Promise<User | null>} - A promise that resolves with the User object or null if not found.
 */
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

    /**
 * Updates the online status of a user by their UID.
 * @param {string} uid - The UID of the user to update.
 * @param {string} status - The new status to set for the user.
 */
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

    /**
 * Validates the input user name for uniqueness and format.
 * @param {string} newUserName - The new user name to validate.
 * @param {string} currentUserName - The current user name of the user (if any).
 * @returns {string} - An error message if validation fails, or an empty string if validation passes.
 */
    validateInputUserName(newUserName: string, currentUserName: string | ''): string {
        let userNameError = '';
        const trimmedUserName = newUserName.trim();
        if (trimmedUserName.length > 0) {
            if (trimmedUserName.length < 2) {
                userNameError = 'Der Name muss mindestens 2 Zeichen lang sein.';
            } else if (!/^[a-zA-ZäöüÄÖÜß\-'\s]+$/.test(trimmedUserName)) {
                userNameError = 'Der Name enthält unzulässige Zeichen.';
            } else if (!this.userNameIsUnique(trimmedUserName, currentUserName)) {
                userNameError = 'Ein User mit diesem Namen existiert bereits.';
            }
        }
        return userNameError;
    }

    /**
 * Validates the input user email for uniqueness and format.
 * @param {string} newEmail - The new email to validate.
 * @param {string} currentUserEmail - The current email of the user (if any).
 * @returns {string} - An error message if validation fails, or an empty string if validation passes.
 */
    validateInputUserEmail(newEmail: string, currentUserEmail: string | ''): string {
        let userEmailError = '';
        const trimmedEmail = newEmail.trim();
        if (trimmedEmail.length > 0) {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(trimmedEmail)) {
                userEmailError = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
            } else if (!this.userEmailIsUnique(trimmedEmail, currentUserEmail)) {
                userEmailError = 'Ein User mit dieser E-Mail-Adresse existiert bereits.';
            }
        }
        return userEmailError;
    }

    /**
 * Checks if a given user name is unique among all users.
 * @param {string} name - The user name to check.
 * @param {string} currentUserName - The current user name of the user (if any).
 * @returns {boolean} - True if the user name is unique, false otherwise.
 */
    userNameIsUnique(name: string, currentUserName: string | ''): boolean {
        if (name == currentUserName) {
            return true;
        } else {
            const userNameLowerCase = name.toLowerCase();
            const users: User[] = this.usersSubject.value;
            return !users.some(user => user.name.toLowerCase() === userNameLowerCase);
        }
    }

    /**
 * Checks if a given email is unique among all users.
 * @param {string} email - The email to check.
 * @param {string} currentUserEmail - The current email of the user (if any).
 * @returns {boolean} - True if the email is unique, false otherwise.
 */
    userEmailIsUnique(email: string, currentUserEmail: string | ''): boolean {
        if (email == currentUserEmail) {
            return true;
        } else {
            const userEmailLowerCase = email.toLowerCase();
            const users: User[] = this.usersSubject.value;
            return !users.some(user => user.email.toLowerCase() === userEmailLowerCase);
        }
    }

}
