import { Like } from './like.class';
import { Reply } from './reply.class';

/**
 * Represents a message within a channel, including metadata and content.
 */
export class ChannelMessage {
    id?: string;
    date: number;
    channelID: string;
    fromUserID: string;
    message: string;
    attachmentID: string;
    likes: Like[];
    replies: Reply[];

    /**
 * Constructs a new ChannelMessage instance.
 * @param {object} obj - An object containing properties to initialize a ChannelMessage instance.
 */
    constructor(obj: any = {}) {
        this.id = obj.id;
        this.date = obj.date ?? 0;
        this.channelID = obj.channelID ?? '';
        this.fromUserID = obj.fromUserID ?? '';
        this.message = obj.message ?? '';
        this.attachmentID = obj.attachmentID ?? '';
        this.likes = obj.likes ?? [];
        this.replies = obj.replies ?? [];
    }

    /**
 * Converts the ChannelMessage instance to a JSON object for storage or transmission.
 * @returns {object} A JSON representation of the ChannelMessage instance.
 */
    public toJSON() {
        const json = {
            date: this.date,
            channelID: this.channelID,
            fromUserID: this.fromUserID,
            attachmentID: this.attachmentID,
            message: this.message,
            likes: this.likes.map(like => like.toJSON()),
            replies: this.replies.map(reply => reply.toJSON())
        };
        return this.id ? { id: this.id, ...json } : json;
    }

    /**
 * Creates a ChannelMessage instance from Firestore document data.
 * @param {any} doc - The Firestore document.
 * @returns {ChannelMessage} A new ChannelMessage instance.
 */
    static fromFirestore(doc: any): ChannelMessage {
        return new ChannelMessage({
            id: doc.id,
            ...doc.data(),
            likes: doc.data().likes ? doc.data().likes.map(Like.fromFirestore) : [],
            replies: doc.data().replies ? doc.data().replies.map(Reply.fromFirestore) : [],
        });
    }
}
