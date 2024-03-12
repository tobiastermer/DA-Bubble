/**
 * Represents a user within the application.
 */
export class User {
    id?: string;
    uid: string;
    name: string;
    email: string;
    avatar: string;

    /**
     * Constructs a new User instance.
     * @param {object} [obj] - An object containing properties to initialize a User instance.
     */
    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.uid = obj ? obj.uid : '';
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.avatar = obj ? obj.avatar : '';
    }

    /**
   * Converts the User instance to a JSON object for storage or transmission.
   * @returns {object} A JSON representation of the User instance.
   */
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

    /**
     * Creates a User instance from Firestore document data.
     * @param {any} doc - The Firestore document.
     * @returns {User} A new User instance.
     */
    static fromFirestore(doc: any): User {
        return new User({
            id: doc.id,
            ...doc.data()
        });
    }

    /**
        * Creates a clone of the current User instance.
        * @returns {User} A new User instance with the same properties as the current one.
        */
    clone() {
        return new User(this.toJSON());
    }

}