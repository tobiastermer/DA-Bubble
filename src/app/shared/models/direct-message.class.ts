import { Like } from './like.class';
import { Reply } from './reply.class';

/**
 * Represents a direct message between users within the application.
 */
export class DirectMessage {
    id?: string;
    date: number;
    userIDs: string[];
    fromUserID: string;
    message: string;
    attachmentID: string;
    likes: Like[];
    replies: Reply[];

    /**
   * Constructs a new DirectMessage instance.
   * @param {object} obj - An object containing properties to initialize a DirectMessage instance.
   */
    constructor(obj: any = {}) {
        this.id = obj.id;
        this.date = obj.date ?? 0;
        this.userIDs = obj.userIDs ?? '';
        this.fromUserID = obj.fromUserID ?? '';
        this.message = obj.message ?? '';
        this.attachmentID = obj.attachmentID ?? '';
        this.likes = obj.likes ?? [];
        this.replies = obj.replies ?? [];
    }

    /**
    * Converts the DirectMessage instance to a JSON object for storage or transmission.
    * @returns {object} A JSON representation of the DirectMessage instance.
    */
    public toJSON() {
        // Bedingte Einbeziehung der ID, nur wenn sie vorhanden ist
        const json = {
            date: this.date,
            userIDs: this.userIDs,
            fromUserID: this.fromUserID,
            attachmentID: this.attachmentID,
            message: this.message,
            likes: this.likes.map(like => like.toJSON()),
            replies: this.replies.map(reply => reply.toJSON())
        };
        return this.id ? { id: this.id, ...json } : json;
    }

    /**
     * Creates a DirectMessage instance from Firestore document data.
     * @param {any} doc - The Firestore document.
     * @returns {DirectMessage} A new DirectMessage instance.
     */
    static fromFirestore(doc: any): DirectMessage {
        return new DirectMessage({
            id: doc.id,
            ...doc.data(),
            likes: doc.data().likes ? doc.data().likes.map(Like.fromFirestore) : [],
            replies: doc.data().replies ? doc.data().replies.map(Reply.fromFirestore) : [],
        });
    }
}
