import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, query, where, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { DirectMessage } from '../models/direct-message.class';

/**
 * Service for managing direct messages between users in a Firestore collection.
 */
@Injectable({
    providedIn: 'root'
})

export class DirectMessagesService {
    private directMessagesSubject = new BehaviorSubject<DirectMessage[]>([]);
    public directMessages$ = this.directMessagesSubject.asObservable();

    firestore: Firestore = inject(Firestore);

    constructor() { }

    /**
     * Adds a new direct message to the Firestore collection.
     * @param {DirectMessage} directMessage - The direct message object to add.
     * @returns {Promise<string>} A promise that resolves with the document ID of the added message.
     */
    async addDirectMessage(directMessage: DirectMessage) {
        try {
            const docRef = await addDoc(collection(this.firestore, "directMessages"), directMessage.toJSON());
            console.log(docRef.id);
            return docRef.id;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    /**
     * Updates an existing direct message in the Firestore collection.
     * @param {DirectMessage} directMessage - The direct message object to update.
     */
    async updateDirectMessage(directMessage: DirectMessage) {
        if (directMessage.id) {
            const docRef = doc(collection(this.firestore, 'directMessages'), directMessage.id);
            await updateDoc(docRef, directMessage.toJSON()).catch(console.error);
        }
    }

     /**
     * Deletes a direct message from the Firestore collection.
     * @param {DirectMessage} directMessage - The direct message object to delete.
     */
    async deleteDirectMessage(directMessage: DirectMessage) {
        await deleteDoc(doc(collection(this.firestore, 'directMessages'), directMessage.id)).catch(
            (err) => { console.log(err); }
        )
    }

      /**
     * Retrieves direct messages involving the current user and another specified user.
     * @param {string} currentUserID - The current user's ID.
     * @param {string} userID2 - The other user's ID.
     */
    getDirectMessages(currentUserID: string, userID2: string) {
        const q = query(
            collection(this.firestore, 'directMessages'),
            where("userIDs", "array-contains", currentUserID)
        );
        if (currentUserID === userID2){
            onSnapshot(q, (snapshot) => {
                const directMessages = snapshot.docs
                    .map(doc => DirectMessage.fromFirestore({ id: doc.id, data: () => doc.data() }))
                    .filter(message => (message.userIDs[0].includes(currentUserID) && message.userIDs[1].includes(userID2)));
                this.directMessagesSubject.next(directMessages);
            });
        } else {
            onSnapshot(q, (snapshot) => {
                const directMessages = snapshot.docs
                    .map(doc => DirectMessage.fromFirestore({ id: doc.id, data: () => doc.data() }))
                    .filter(message => message.userIDs.includes(currentUserID && userID2));
                this.directMessagesSubject.next(directMessages);
            });
        }
    }

}