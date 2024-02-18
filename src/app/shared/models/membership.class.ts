export class Membership {
    id: string;
    channelID: string;
    userID: string;

    constructor(obj: any = {}) {
        this.id = obj.id || '';
        this.channelID = obj.channelID || '';
        this.userID = obj.userID || '';
    }

    public toJSON() {
        return {
            channelID: this.channelID,
            userID: this.userID,
            // Nur die ID hinzufügen, wenn sie existiert
            ...(this.id && { id: this.id }),
        };
    }

    static fromFirestore(doc: any): Membership {
        return new Membership({
            id: doc.id,
            ...doc.data()
        });
    }
}
