import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Membership } from '../models/membership.class';

@Injectable({
    providedIn: 'root'
})

export class MembershipService {

    private userMembershipsSubject = new BehaviorSubject<Membership[]>([]);
    public userMemberships$ = this.userMembershipsSubject.asObservable();
    userMemberships: Membership[] = [];



    firestore: Firestore = inject(Firestore);

    constructor() { }

    getUserMemberships(userID: string) {
        const q = query(collection(this.firestore, 'memberships'), where("userID", "==", userID));
        return onSnapshot(q, (list) => {
            const memberships: Membership[] = [];
            list.forEach(element => {
                memberships.push(this.setMembershipObject(element.data(), element.id));
            });
            this.userMembershipsSubject.next(memberships); // Aktualisiere das BehaviorSubject
        });
    }

    getCleanJSON(membership: Membership): {} {
        return {
            channelID: membership.channelID,
            userID: membership.userID,
        }
    }

    setMembershipObject(obj: any, id: string): Membership {
        return {
            id: id,
            channelID: obj.channelID || "",
            userID: obj.userID || "",
        }
    }
}
