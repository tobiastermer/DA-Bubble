import { Like } from "./like.class";

/**
 * Represents a reply to a channel message within the application.
 */
export class Reply {
    date: number;
    channelID: string;
    userID: string;
    message: string;
    attachmentID: string;
    likes: Like[];

    /**
     * Constructs a new Reply instance.
     * @param {object} obj - An object containing properties to initialize a Reply instance.
     */
    constructor(obj: any = {}) {
        this.date = obj.date ?? 0;
        this.channelID = obj.channelID ?? '';
        this.userID = obj.userID ?? '';
        this.message = obj.message ?? '';
        this.attachmentID = obj.attachmentID ?? '';
        this.likes = obj.likes ?? [];
    }

    /**
     * Converts the Reply instance to a JSON object for storage or transmission.
     * @returns {object} A JSON representation of the Reply instance.
     */
    public toJSON() {
        return {
            date: this.date,
            channelID: this.channelID,
            userID: this.userID,
            message: this.message,
            attachmentID: this.attachmentID,
            likes: this.likes.map(like => like.toJSON()),
        };
    }

    /**
     * Creates a Reply instance from Firestore document data.
     * @param {any} doc - The Firestore document.
     * @returns {Reply} A new Reply instance.
     */
    static fromFirestore(doc: any): Reply {
        return new Reply({
            date: doc.date,
            channelID: doc.channelID,
            userID: doc.userID,
            message: doc.message,
            attachmentID: doc.attachmentID,
            likes: doc.likes ? doc.likes.map(Like.fromFirestore) : [],
        });
    }
}
