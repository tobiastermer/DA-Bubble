import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, query, where, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { ChannelMessage } from '../models/channel-message.class';

@Injectable({
    providedIn: 'root'
})

export class ChannelMessagesService {
    private channelMessagesSubject = new BehaviorSubject<ChannelMessage[]>([]);
    public channelMessages$ = this.channelMessagesSubject.asObservable();

    private allChannelMessagesSubject = new BehaviorSubject<ChannelMessage[]>([]);
    public allChannelMessages$ = this.allChannelMessagesSubject.asObservable();

    firestore: Firestore = inject(Firestore);

    constructor() { }


    /**
     * Adds a new channel message to Firestore.
     * @param {ChannelMessage} channelMessage - The channel message to add.
     * @returns {Promise<string | unknown>} A promise that resolves to the ID of the added document or an error object if an error occurs.
     */
    async addChannelMessage(channelMessage: ChannelMessage): Promise<string | unknown> {
        try {
            const docRef = await addDoc(collection(this.firestore, "channelConversations"), channelMessage.toJSON());
            return docRef.id;
        } catch (err) {
            console.error(err);
            return err;
        }
    }


    /**
     * Updates an existing channel message in Firestore.
     * @param {ChannelMessage} channelMessage - The updated channel message.
     */
    async updateChannelMessage(channelMessage: ChannelMessage) {
        if (channelMessage.id) {
            const docRef = doc(collection(this.firestore, 'channelConversations'), channelMessage.id);
            await updateDoc(docRef, channelMessage.toJSON()).catch(console.error);
        }
    }


    /**
     * Deletes a channel message from Firestore.
     * @param {ChannelMessage} channelMessage - The channel message to delete.
     */
    async deleteChannelMessage(channelMessage: ChannelMessage) {
        await deleteDoc(doc(collection(this.firestore, 'channelConversations'), channelMessage.id)).catch(
            (err) => { console.log(err); }
        )
    }


    /**
     * Retrieves channel messages for a specific channel from Firestore and subscribes to changes.
     * @param {string} channelID - The ID of the channel to retrieve messages for.
     */
    getChannelMessages(channelID: string) {
        const q = query(collection(this.firestore, 'channelConversations'), where("channelID", "==", channelID));
        onSnapshot(q, (snapshot) => {
            const channelMessages = snapshot.docs.map(doc => ChannelMessage.fromFirestore({ id: doc.id, data: () => doc.data() }));
            this.channelMessagesSubject.next(channelMessages);
        });
    }


    /**
     * Retrieves all channel messages from Firestore and subscribes to changes.
     */
    getAllChannelMessages() {
        const q = query(collection(this.firestore, 'channelConversations'));
        onSnapshot(q, (snapshot) => {
            let messages = snapshot.docs.map(doc => ChannelMessage.fromFirestore({ id: doc.id, data: () => doc.data() }));
            this.allChannelMessagesSubject.next(messages);
        });
    }
}