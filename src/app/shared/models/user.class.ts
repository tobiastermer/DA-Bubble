export class User {
    id?: string;
    name: string;
    email: string;
    avatar: number;
    status: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.avatar = obj ? obj.avatar : 0;
        this.status = obj ? obj.status : '';
    }

    public toJSON() {
        return {
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            status: this.status,
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

}