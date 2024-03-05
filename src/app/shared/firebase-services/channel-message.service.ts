import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
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

    async addChannelMessage(channelMessage: ChannelMessage) {
        try {
            const docRef = await addDoc(collection(this.firestore, "channelConversations"), channelMessage.toJSON());
            console.log(docRef.id);
            return docRef.id;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async updateChannelMessage(channelMessage: ChannelMessage) {
        if (channelMessage.id) {
            const docRef = doc(collection(this.firestore, 'channelConversations'), channelMessage.id);
            await updateDoc(docRef, channelMessage.toJSON()).catch(console.error);
        }
    }

    async deleteChannelMessage(channelMessage: ChannelMessage) {
        await deleteDoc(doc(collection(this.firestore, 'channelConversations'), channelMessage.id)).catch(
            (err) => { console.log(err); }
        )
    }

    getChannelMessages(channelID: string) {
        const q = query(collection(this.firestore, 'channelConversations'), where("channelID", "==", channelID));
        onSnapshot(q, (snapshot) => {
            const channelMessages = snapshot.docs.map(doc => ChannelMessage.fromFirestore({id: doc.id, data: () => doc.data()}));
            this.channelMessagesSubject.next(channelMessages);
        });
    }

    getAllChannelMessages() {
        const q = query(collection(this.firestore, 'channelConversations'));
        onSnapshot(q, (snapshot) => {
            let messages = snapshot.docs.map(doc => ChannelMessage.fromFirestore({ id: doc.id, data: () => doc.data() }));
            this.allChannelMessagesSubject.next(messages);
        });
    }
}