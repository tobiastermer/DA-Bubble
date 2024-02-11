export class Reply {
    date: number;
    channelID: string;
    userID: string;
    message: string;
    attachmentID: string;
    
    constructor(obj?: any) {
        // this.id = obj ? obj.id : '';
        this.date = obj ? obj.date : 0;
        this.channelID = obj ? obj.channelID : '';
        this.userID = obj ? obj.userID : '';
        this.message = obj ? obj.message : '';
        this.attachmentID = obj ? obj.attachmentID : '';
    }
}