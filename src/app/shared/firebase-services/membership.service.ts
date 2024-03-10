import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, collectionData, query, where, limit, orderBy, onSnapshot, addDoc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Membership } from '../models/membership.class';
import { DataService } from '../services/data.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Service for managing memberships between users and channels.
 */
export class MembershipService {
    private userMembershipsSubject = new BehaviorSubject<Membership[]>([]);
    public userMemberships$ = this.userMembershipsSubject.asObservable();

    private channelMembershipsSubject = new BehaviorSubject<Membership[]>([]);
    public channelMemberships$ = this.channelMembershipsSubject.asObservable();

    firestore: Firestore = inject(Firestore);

    constructor(
        private dataService: DataService,
    ) { }

    /**
     * Creates a new Membership instance.
     * @param {string} userID - The user ID for the membership.
     * @param {string} channelID - The channel ID for the membership.
     * @returns {Membership} - The new Membership instance.
     */
    createMembership(userID: string, channelID: string): Membership {
        return new Membership({
            channelID: channelID,
            userID: userID
        });
    }

    /**
    * Adds a new membership to the Firestore database.
    * @param {Membership} membership - The membership to add.
    * @returns {Promise<string>} - A promise that resolves with the document ID of the added membership.
    */
    async addMembership(membership: Membership) {
        try {
            const docRef = await addDoc(collection(this.firestore, "memberships"), membership.toJSON());
            return docRef.id;
        } catch (err) {
            console.error(err);
            return err;
        }
    }

    /**
    * Updates an existing membership in the Firestore database.
    * @param {Membership} membership - The membership to update.
    */
    async updateMembership(membership: Membership) {
        if (membership.id) {
            const docRef = doc(collection(this.firestore, 'memberships'), membership.id);
            await updateDoc(docRef, membership.toJSON()).catch(console.error);
        }
    }

    /**
     * Deletes a membership from the Firestore database.
     * @param {Membership} membership - The membership to delete.
     */
    async deleteMembership(membership: Membership) {
        await deleteDoc(doc(collection(this.firestore, 'memberships'), membership.id)).catch(
            (err) => { console.log(err); }
        )
    }

    /**
    * Retrieves memberships based on user ID and channel ID.
    * @param {string} userID - The user ID to filter by.
    * @param {string} channelID - The channel ID to filter by.
    * @returns {Promise<Membership[]>} - A promise that resolves with an array of memberships.
    */
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

    /**
    * Retrieves all memberships for a given user ID.
    * @param {string} [userID] - The user ID to filter by. If not provided, uses the current user's ID.
    */
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

    /**
         * Retrieves all memberships for a given channel ID.
         * @param {string} channelID - The channel ID to filter by.
         */
    getChannelMemberships(channelID: string) {
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