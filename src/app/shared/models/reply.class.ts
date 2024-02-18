export class Reply {
    date: number;
    channelID: string;
    userID: string;
    message: string;
    attachmentID: string;

    constructor(obj: any = {}) {
        this.date = obj.date ?? 0;
        this.channelID = obj.channelID ?? '';
        this.userID = obj.userID ?? '';
        this.message = obj.message ?? '';
        this.attachmentID = obj.attachmentID ?? '';
    }

    public toJSON() {
        return {
            date: this.date,
            channelID: this.channelID,
            userID: this.userID,
            message: this.message,
            attachmentID: this.attachmentID,
        };
    }

    static fromFirestore(doc: any): Reply {
        return new Reply({
            date: doc.date,
            channelID: doc.channelID,
            userID: doc.userID,
            message: doc.message,
            attachmentID: doc.attachmentID,
        });
    }
}
