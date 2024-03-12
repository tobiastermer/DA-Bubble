/**
 * Represents a communication channel within the application, including its metadata.
 */
export class Channel {
    id: string;
    name: string;
    description: string;
    ownerID: string;

    /**
     * Constructs a new Channel instance.
     * @param {object} obj - An object containing properties to initialize a Channel instance.
     */
    constructor(obj: any = {}) {
        this.id = obj.id || '';
        this.name = obj.name || '';
        this.description = obj.description || '';
        this.ownerID = obj.ownerID || '';
    }

    /**
     * Converts the Channel instance to a JSON object for storage or transmission.
     * @returns {object} A JSON representation of the Channel instance.
     */
    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            ownerID: this.ownerID,
            // Nur die ID hinzufügen, wenn sie existiert
            ...(this.id && { id: this.id }),
        };
    }

    /**
     * Creates a Channel instance from Firestore document data.
     * @param {any} doc - The Firestore document.
     * @returns {Channel} A new Channel instance.
     */
    static fromFirestore(doc: any): Channel {
        return new Channel({
            id: doc.id,
            ...doc.data()
        });
    }
}
