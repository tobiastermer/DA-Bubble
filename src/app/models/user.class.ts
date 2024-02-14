export class User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: number;
    status: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        this.avatar = obj ? obj.avatar : NaN;
        this.status = obj ? obj.status : '';
    }

    public toJSON?() {
        const jsonObj: any = {
            firstName: this.firstName,
            lastName: this.lastName,
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