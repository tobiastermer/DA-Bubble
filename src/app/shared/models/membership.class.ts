/**
 * Represents a membership of a user in a channel.
 */
export class Membership {
    id: string;
    channelID: string;
    userID: string;

    /**
     * Constructs a new Membership instance.
     * @param {object} obj - An object containing properties to initialize a Membership instance.
     */
    constructor(obj: any = {}) {
        this.id = obj.id || '';
        this.channelID = obj.channelID || '';
        this.userID = obj.userID || '';
    }

    /**
     * Converts the Membership instance to a JSON object for storage or transmission.
     * @returns {object} A JSON representation of the Membership instance.
     */
    public toJSON() {
        return {
            channelID: this.channelID,
            userID: this.userID,
            // Nur die ID hinzufügen, wenn sie existiert
            ...(this.id && { id: this.id }),
        };
    }

    /**
     * Creates a Membership instance from Firestore document data.
     * @param {any} doc - The Firestore document.
     * @returns {Membership} A new Membership instance.
     */
    static fromFirestore(doc: any): Membership {
        return new Membership({
            id: doc.id,
            ...doc.data()
        });
    }
}
