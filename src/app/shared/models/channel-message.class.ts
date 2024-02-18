import { Like } from './like.class';
import { Reply } from './reply.class';

export class ChannelMessage {
    id?: string;
    date: number;
    channelID: string;
    fromUserID: string;
    attachmentID: string;
    likes: Like[];
    replies: Reply[];

    constructor(obj: any = {}) {
        this.id = obj.id;
        this.date = obj.date ?? 0;
        this.channelID = obj.channelID ?? '';
        this.fromUserID = obj.fromUserID ?? '';
        this.attachmentID = obj.attachmentID ?? '';
        this.likes = obj.likes ?? [];
        this.replies = obj.replies ?? [];
    }

    public toJSON() {
        // Bedingte Einbeziehung der ID, nur wenn sie vorhanden ist
        const json = {
            date: this.date,
            channelID: this.channelID,
            fromUserID: this.fromUserID,
            attachmentID: this.attachmentID,
            likes: this.likes.map(like => like.toJSON()),
            replies: this.replies.map(reply => reply.toJSON())
        };
        return this.id ? { id: this.id, ...json } : json;
    }

    static fromFirestore(doc: any): ChannelMessage {
        return new ChannelMessage({
            id: doc.id,
            ...doc.data(),
            likes: doc.data().likes ? doc.data().likes.map(Like.fromFirestore) : [],
            replies: doc.data().replies ? doc.data().replies.map(Reply.fromFirestore) : [],
        });
    }
}
