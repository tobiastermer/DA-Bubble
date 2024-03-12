import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class TimeStempService {
    constructor() { }

    /**
     * Retrieves a timestamp string based on the provided message time.
     * @param {number} msgTime - The timestamp of the message.
     * @returns {string} The formatted timestamp string.
     */
    public getTimeStemp(msgTime: number): string {
        let time = new Date(msgTime);
        let toDay = new Date();
        if (time.getUTCFullYear() !== toDay.getFullYear()) return time.toISOString().substring(0, 10)
        if (time.toDateString() === toDay.toDateString()) return 'Heute'
        const weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        const month = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        return weekday[time.getUTCDay()] + ', ' + time.getDate() + ' ' + month[time.getUTCMonth()]
    }

}