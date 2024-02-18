import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Channel } from '../models/channel.class';

@Injectable({
    providedIn: 'root'
})

export class ChannelService {
    private channelsSubject = new BehaviorSubject<Channel[]>([]);
    public channels$ = this.channelsSubject.asObservable();
    firestore: Firestore = inject(Firestore);

    constructor() {
        this.getChannels();
    }

    async addChannel(channel: Channel) {
        try {
            const docRef = await addDoc(collection(this.firestore, "channels"), channel.toJSON());
            console.log(docRef.id);
            return docRef.id;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async updateChannel(channel: Channel) {
        if (channel.id) {
            const docRef = doc(collection(this.firestore, 'channels'), channel.id);
            await updateDoc(docRef, channel.toJSON()).catch(console.error);
        }
    }

    getChannels() {
        const q = query(collection(this.firestore, 'channels'));
        onSnapshot(q, (snapshot) => {
            const channels = snapshot.docs.map(doc => Channel.fromFirestore({id: doc.id, data: () => doc.data()}));
            this.channelsSubject.next(channels);
        });
    }

    async getChannelByID(channelID: string): Promise<Channel | null> {
        try {
            const docRef = doc(this.firestore, 'channels', channelID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const channel = new Channel({
                    id: docSnap.id,
                    ...docSnap.data()
                });
                return channel;
            } else {
                console.log('No such channel doc!');
                return null;
            }
        } catch (error) {
            console.error("Error getting channel doc:", error);
            return null;
        }
    }
}