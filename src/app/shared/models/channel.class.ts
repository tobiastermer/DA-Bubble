export class Channel {
    id: string;
    name: string;
    description: string;
    ownerID: string;

    constructor(obj: any = {}) {
        this.id = obj.id || '';
        this.name = obj.name || '';
        this.description = obj.description || '';
        this.ownerID = obj.ownerID || '';
    }

    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            ownerID: this.ownerID,
            // Nur die ID hinzufügen, wenn sie existiert
            ...(this.id && { id: this.id }),
        };
    }

    static fromFirestore(doc: any): Channel {
        return new Channel({
            id: doc.id,
            ...doc.data()
        });
    }
}
