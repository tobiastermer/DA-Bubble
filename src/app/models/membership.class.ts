export class Membership {
    id: string;
    channelID: string;
    userID: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.channelID = obj ? obj.channelID : '';
        this.userID = obj ? obj.userID : '';
    }

    public toJSON?() {
        const jsonObj: any = {
            channelID: this.channelID,
            userID: this.userID,
        };

        if (this.id !== undefined) {
            jsonObj.id = this.id;
        }

        return jsonObj;
    }

}