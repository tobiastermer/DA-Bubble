export class Like {
    emoji: string;
    userID: string;
    date: number;

    constructor(obj: any = {}) {
        this.userID = obj.userID ?? '';
        this.emoji = obj.emoji ?? 0;
        this.date = obj.date ?? 0;
    }

    public toJSON() {
        return {
            emoji: this.emoji,
            userID: this.userID,
            date: this.date,
        };
    }

    static fromFirestore(doc: any): Like {
        return new Like({
            userID: doc.userID,
            emoji: doc.emoji,
            date: doc.date,
        });
    }
}

export interface SortedLikes{
    emoji: string,
    usersIDs: string[]
}