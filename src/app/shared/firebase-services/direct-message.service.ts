import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { DirectMessage } from '../models/direct-message.class';

@Injectable({
    providedIn: 'root'
})

export class DirectMessagesService {
    private directMessagesSubject = new BehaviorSubject<DirectMessage[]>([]);
    public directMessages$ = this.directMessagesSubject.asObservable();

    firestore: Firestore = inject(Firestore);

    constructor() { }

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

    async updateDirectMessage(directMessage: DirectMessage) {
        if (directMessage.id) {
            const docRef = doc(collection(this.firestore, 'directMessages'), directMessage.id);
            await updateDoc(docRef, directMessage.toJSON()).catch(console.error);
        }
    }

    async deleteDirectMessage(directMessage: DirectMessage) {
        await deleteDoc(doc(collection(this.firestore, 'directMessages'), directMessage.id)).catch(
            (err) => { console.log(err); }
        )
    }

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