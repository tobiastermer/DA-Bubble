import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class'
import { BehaviorSubject } from 'rxjs';
import { Channel } from '../models/channel.class';

@Injectable({
    providedIn: 'root'
})

export class ChannelService {

    private chanellsSubject = new BehaviorSubject<Channel[]>([]);
    public channels$ = this.chanellsSubject.asObservable();
    channels: Channel[] = [];
    subscribeChannels;
    firestore: Firestore = inject(Firestore);

    constructor() {
        this.subscribeChannels = this.getChannels();
    }

    getChannels() {
        const q = query(collection(this.firestore, 'channels'));
        return onSnapshot(q, (list) => {
            const channels: Channel[] = [];
            list.forEach(element => {
                channels.push(this.setChannelObject(element.data(), element.id));
            });
            this.chanellsSubject.next(channels); // Aktualisiere das BehaviorSubject
        });
    }

    getCleanJSON(user: Channel): {} {
        return {
            name: user.name,
            description: user.description,
            ownerID: user.ownerID,
        }
    }

    setChannelObject(obj: any, id: string): Channel {
        return {
            id: id,
            name: obj.name || "",
            description: obj.description || "",
            ownerID: obj.ownerID || "",
        }
    }
}
