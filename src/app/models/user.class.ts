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
        this.avatar = obj ? obj.avatar : NaN;
        this.status = obj ? obj.status : '';
    }

    public toJSON?() {
        const jsonObj: any = {
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            status: this.status,
        };

        if (this.id !== undefined) {
            jsonObj.id = this.id;
        }

        return jsonObj;
    }

    }