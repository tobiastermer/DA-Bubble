export class Like {
    emoji: number;
    userID: string;
    date: number;
    

    constructor(obj?: any) {
        // this.id = obj ? obj.id : '';
        this.userID = obj ? obj.userID : '';
        this.emoji = obj ? obj.emoji : 0;
        this.date = obj ? obj.date : 0;
    }
}