import { Like } from './like.class';
import { Reply } from './reply.class';

export class ChannelMessage {
    id: string;
    date: number;
    channelID: string;
    fromUserID: string;
    attachmentID: string;
    likes: Like[];
    replies: Reply[];

    constructor(obj?: any) {
        this.id = obj?.id ?? '';
        this.date = obj?.date ?? 0;
        this.channelID = obj?.channelID ?? '';
        this.fromUserID = obj?.fromUserID ?? '';
        this.attachmentID = obj?.attachmentID ?? '';
        this.likes = obj?.likes ?? [];
        this.replies = obj?.replies ?? [];
    }

    public toJSON() {
        return {
            id: this.id,
            date: this.date,
            channelID: this.channelID,
            fromUserID: this.fromUserID,
            attachmentID: this.attachmentID,
            likes: this.likes,
            replies: this.replies
        };
    }
}
