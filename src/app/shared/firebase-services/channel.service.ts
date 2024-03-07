import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, query, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
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


    /**
     * Adds a new channel to Firestore.
     * @param {Channel} channel - The channel to add.
     * @returns {Promise<string | unknown>} A promise that resolves to the ID of the added document or an error object if an error occurs.
     */
    async addChannel(channel: Channel): Promise<string | unknown> {
        try {
            const docRef = await addDoc(collection(this.firestore, "channels"), channel.toJSON());
            return docRef.id;
        } catch (err) {
            console.error(err);
            return err;
        }
    }


    /**
     * Updates an existing channel in Firestore.
     * @param {Channel} channel - The updated channel.
     */
    async updateChannel(channel: Channel) {
        if (!channel.id) return
        const docRef = doc(collection(this.firestore, 'channels'), channel.id);
        await updateDoc(docRef, channel.toJSON()).catch(console.error);
    }


    /**
     * Deletes a channel from Firestore.
     * @param {Channel} channel - The channel to delete.
     */
    async deleteChannel(channel: Channel) {
        await deleteDoc(doc(collection(this.firestore, 'channels'), channel.id)).catch(
            (err) => { console.log(err); }
        )
    }


    /**
     * Retrieves all channels from Firestore and subscribes to changes.
     */
    getChannels() {
        const q = query(collection(this.firestore, 'channels'));
        onSnapshot(q, (snapshot) => {
            const channels = snapshot.docs.map(doc => Channel.fromFirestore({ id: doc.id, data: () => doc.data() }));
            this.channelsSubject.next(channels);
        });
    }


    /**
     * Retrieves a channel by its ID from Firestore.
     * @param {string} channelID - The ID of the channel to retrieve.
     * @returns {Promise<Channel | null>} A promise that resolves to the channel object if found, or null if not found or an error occurs.
     */
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


    /**
     * Validates the input channel name.
     * @param {string} newChannelName - The new channel name.
     * @param {string | ''} currentChannelName - The current channel name.
     * @returns {string} The error message, if any.
     */
    validateInputChannelName(newChannelName: string, currentChannelName: string | ''): string {
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


    /**
     * Validates the input channel description.
     * @param {string} newChannelDescription - The new channel description.
     * @returns {string} The error message, if any.
     */
    validateInputChannelDescription(newChannelDescription: string): string {
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


    /**
     * Checks if the channel name is unique.
     * @param {string} name - The channel name to check.
     * @param {string | ''} currentChannelName - The current channel name.
     * @returns {boolean} A boolean indicating whether the channel name is unique.
     */
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