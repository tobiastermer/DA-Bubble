export class User {
    id?: string;
    uid: string;
    name: string;
    email: string;
    avatar: string;
    status: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.uid = obj ? obj.uid : '';
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.avatar = obj ? obj.avatar : '';
        this.status = obj ? obj.status : '';
    }

    public toJSON() {
        return {
            uid: this.uid,
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            // Bedingte Einbeziehung der ID, nur wenn sie vorhanden ist
            ...(this.id && { id: this.id }),
        };
    }

    static fromFirestore(doc: any): User {
        return new User({
            id: doc.id,
            ...doc.data()
        });
    }


    clone() {
        return new User(this.toJSON());
    }

}