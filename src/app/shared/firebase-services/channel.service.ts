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

    async deleteChannel(channel: Channel) {
        await deleteDoc(doc(collection(this.firestore, 'channels'), channel.id)).catch(
            (err) => { console.log(err); }
        )
    }

    getChannels() {
        const q = query(collection(this.firestore, 'channels'));
        onSnapshot(q, (snapshot) => {
            const channels = snapshot.docs.map(doc => Channel.fromFirestore({ id: doc.id, data: () => doc.data() }));
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

    validateInputChannelName(newChannelName: string, currentChannelName: string | '') {
        let channelNameError = '';
        if (newChannelName.length > 0) {
            if (newChannelName.length < 5) {
                channelNameError = 'Der Channel-Name muss mindestens 5 Zeichen lang sein.';
            } else if (newChannelName.includes(' ')) {
                channelNameError = 'Der Channel-Name darf keine Leerzeichen enthalten.';
            } else if (!this.channelNameIsUnique(newChannelName, currentChannelName)) {
                channelNameError = 'Ein Channel mit diesem Namen existiert bereits.';
            } else {
                channelNameError = '';
            }
        } else {
            channelNameError = '';
        }
        return channelNameError;
    }

    validateInputChannelDescription(newChannelDescription: string) {
        let channelDescriptionError = '';
        if (newChannelDescription.length > 0) {
            if (newChannelDescription.length < 5) {
                channelDescriptionError = 'Die Beschreibung muss mindestens 5 Zeichen lang sein.';
            } else {
                channelDescriptionError = '';
            }
        } else {
            channelDescriptionError = '';
        }
        return channelDescriptionError;
    }

    channelNameIsUnique(name: string, currentChannelName: string | ''): boolean {
        if (name == currentChannelName) {
            return true;
        } else {
            const channelNameLowerCase = name.toLowerCase();
            const channels: Channel[] = this.channelsSubject.value;
            return !channels.some(channel => channel.name.toLowerCase() === channelNameLowerCase);
        }
    }

}