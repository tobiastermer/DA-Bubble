/**
 * Represents a like on a message or reply within the application.
 */
export class Like {
    emoji: string;
    userID: string;
    date: number;

    /**
     * Constructs a new Like instance.
     * @param {object} obj - An object containing properties to initialize a Like instance.
     */
    constructor(obj: any = {}) {
        this.userID = obj.userID ?? '';
        this.emoji = obj.emoji ?? 0;
        this.date = obj.date ?? 0;
    }

    /**
   * Converts the Like instance to a JSON object for storage or transmission.
   * @returns {object} A JSON representation of the Like instance.
   */
    public toJSON() {
        return {
            emoji: this.emoji,
            userID: this.userID,
            date: this.date,
        };
    }

    /**
   * Creates a Like instance from Firestore document data.
   * @param {any} doc - The Firestore document.
   * @returns {Like} A new Like instance.
   */
    static fromFirestore(doc: any): Like {
        return new Like({
            userID: doc.userID,
            emoji: doc.emoji,
            date: doc.date,
        });
    }
}

/**
 * Represents a structured format for likes sorted by emoji.
 * @typedef {Object} SortedLikes
 * @property {string} emoji - The emoji character representing the like.
 * @property {string[]} usersIDs - An array of user IDs who have liked with this emoji.
 */
export interface SortedLikes {
    emoji: string,
    usersIDs: string[]
}