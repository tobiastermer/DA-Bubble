import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Membership } from '../models/membership.class';
import { DataService } from '../services/data.service';

@Injectable({
    providedIn: 'root'
})

export class MembershipService {
    private userMembershipsSubject = new BehaviorSubject<Membership[]>([]);
    public userMemberships$ = this.userMembershipsSubject.asObservable();

    private channelMembershipsSubject = new BehaviorSubject<Membership[]>([]);
    public channelMemberships$ = this.channelMembershipsSubject.asObservable();

    firestore: Firestore = inject(Firestore);

    constructor(
        private dataService: DataService,
    ) { }

    createMembership(userID: string, channelID: string): Membership {
        return new Membership({
            channelID: channelID,
            userID: userID
        });
    }

    async addMembership(membership: Membership) {
        try {
            const docRef = await addDoc(collection(this.firestore, "memberships"), membership.toJSON());
            return docRef.id;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    async updateMembership(membership: Membership) {
        if (membership.id) {
            const docRef = doc(collection(this.firestore, 'memberships'), membership.id);
            await updateDoc(docRef, membership.toJSON()).catch(console.error);
        }
    }

    async deleteMembership(membership: Membership) {
        await deleteDoc(doc(collection(this.firestore, 'memberships'), membership.id)).catch(
            (err) => { console.log(err); }
        )
    }

    async getMembershipID(userID: string, channelID: string): Promise<Membership[]> {
        if (userID && channelID) {
            try {
                const q = query(collection(this.firestore, 'memberships'), where("userID", "==", userID), where("channelID", "==", channelID));
                const querySnapshot = await getDocs(q);
                const memberships = querySnapshot.docs.map(doc => Membership.fromFirestore({ id: doc.id, data: () => doc.data() }));
                return memberships;
            } catch (error) {
                console.error("Error getting Membership ID:", error);
                return [];
            }
        } else {
            console.error("Error getting Membership ID");
            return [];
        }
    }

    getUserMemberships(userID?: string) {
        // Überprüfe, ob userID definiert ist, andernfalls versuche, die ID aus dataService.currentUser zu verwenden
        const effectiveUserID = userID || this.dataService.currentUser?.id;

        if (!effectiveUserID) {
            console.error("Error: Keine gültige userID für die Abfrage der Mitgliedschaften.");
            return;
        }

        const q = query(collection(this.firestore, 'memberships'), where("userID", "==", effectiveUserID));
        onSnapshot(q, (snapshot) => {
            const memberships = snapshot.docs.map(doc => Membership.fromFirestore({ id: doc.id, data: () => doc.data() }));
            this.userMembershipsSubject.next(memberships);
        });
    }


    getChannelMemberships(channelID: string) {
        console.log('Übergebene CHannel ID ist: ', channelID);
        if (channelID) {
            const q = query(collection(this.firestore, 'memberships'), where("channelID", "==", channelID));
            onSnapshot(q, (snapshot) => {
                const memberships = snapshot.docs.map(doc => Membership.fromFirestore({ id: doc.id, data: () => doc.data() }));
                this.channelMembershipsSubject.next(memberships);
            });
        } else {
            console.error("Error getting Channel Memberships");
        }
    }
}