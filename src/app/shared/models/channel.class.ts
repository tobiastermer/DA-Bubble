export class Channel {
    id: string;
    name: string;
    description: string;
    ownerID: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.ownerID = obj ? obj.ownerID : '';
    }

    public toJSON?() {
        const jsonObj: any = {
            name: this.name,
            description: this.description,
            ownerID: this.ownerID,
        };

        if (this.id !== undefined) {
            jsonObj.id = this.id;
        }

        return jsonObj;
    }

}