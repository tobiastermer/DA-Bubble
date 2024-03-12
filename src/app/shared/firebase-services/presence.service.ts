import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Database,
  objectVal,
  set,
  ref,
  onDisconnect,
  serverTimestamp,
} from '@angular/fire/database';
import { first } from 'rxjs/operators';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';
import { onValue } from 'firebase/database';
import { Router } from '@angular/router';

/**
 * Service to manage user presence status in real-time, including online, offline, and away statuses.
 */
@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private timeoutID: any;
  private inactivityTimeout: any;
  private guestUid = 't8WOIhqo9BYogI9FmZhtCHP7K3t1';
  private trackingEnabled = false;

  constructor(
    private auth: Auth,
    private db: Database,
    private userService: UserService,
    private router: Router
  ) {
    this.initPresence();
  }

  /**
  * Initializes presence tracking by updating on disconnect and adding activity listeners if in a browser environment.
  */
  private initPresence(): void {
    this.updateOnDisconnect();
    if (this.isPlatformBrowser()) {
      this.addActivityListeners();
    }
  }

  /**
  * Checks if the current platform is a browser.
  * @returns {boolean} True if the current platform is a browser, false otherwise.
  */
  private isPlatformBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Updates the user's status in the database.
   * @param {string} uid - The user's unique identifier.
   * @param {string} status - The user's new status.
   */
  private async setUserStatus(uid: string, status: string): Promise<void> {
    const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);
    const statusForDatabase = {
      state: status,
      last_changed: serverTimestamp(),
    };

    set(userStatusDatabaseRef, statusForDatabase).catch((error) =>
      console.error(`status ${uid}:`, error)
    );
  }

  /**
   * Resets the inactivity timer and updates the user's status to online.
   */
  private resetTimer(): void {
    authState(this.auth)
      .pipe(first())
      .toPromise()
      .then((user) => {
        const uid = user ? user.uid : this.guestUid;
        this.startInactivityTimer(uid);
        this.setUserStatus(uid, 'online');
      });
  }

  /**
   * Starts a timer that sets the user's status to 'away' after a period of inactivity.
   * @param {string} uid - The user's unique identifier.
   */
  private startInactivityTimer(uid: string): void {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => this.setUserStatus(uid, 'away'), 60000);
  }

  private resetTimerBound = this.resetTimer.bind(this);

  /**
   * Adds event listeners for user activity to reset the inactivity timer.
   */
  private addActivityListeners(): void {
    window.addEventListener('mousemove', this.resetTimerBound);
    window.addEventListener('keydown', this.resetTimerBound);
  }

  /**
   * Removes event listeners for user activity.
   */
  private removeActivityListeners(): void {
    window.removeEventListener('mousemove', this.resetTimerBound);
    window.removeEventListener('keydown', this.resetTimerBound);
  }

  /**
  * Updates the user's status to 'online' upon login and starts tracking their activity.
  * @param {string} uid - The user's unique identifier.
  */
  async updateOnUserLogin(uid: string): Promise<void> {
    const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);
    const isOnlineForDatabase = {
      state: 'online',
      last_changed: serverTimestamp(),
    };

    await set(userStatusDatabaseRef, isOnlineForDatabase);
    this.startInactivityTimer(uid);
    await this.userService.updateUserStatusByUid(uid, 'online');

    this.monitorConnection(userStatusDatabaseRef);

    // Aktiviere das Tracking und füge Aktivitätslistener hinzu
    this.trackingEnabled = true;
    this.addActivityListeners();
  }

  /**
  * Monitors the connection status and sets the user's status to 'offline' upon disconnect.
  * @param {any} userStatusDatabaseRef - A reference to the user's status in the database.
  */
  private async monitorConnection(userStatusDatabaseRef: any): Promise<void> {
    const connectedRef = ref(this.db, '.info/connected');
    objectVal(connectedRef).subscribe((connected) => {
      if (connected === false) {
        return;
      }
      onDisconnect(userStatusDatabaseRef).set({
        state: 'offline',
        last_changed: serverTimestamp(),
      });
    });
  }

  /**
   * Sets the user's status to 'offline' when they disconnect.
   */
  async updateOnDisconnect(): Promise<void> {
    const user = await authState(this.auth).pipe(first()).toPromise();
    const uid = user ? user.uid : this.guestUid;
    const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);
    await this.setUserStatus(uid, 'offline');
    this.monitorConnection(userStatusDatabaseRef);
  }

  /**
   * Retrieves and observes the user's current status.
   * @param {string} uid - The user's unique identifier.
   * @returns {BehaviorSubject<string>} A BehaviorSubject representing the user's current status.
   */
  getUserStatus(uid: string): BehaviorSubject<string> {
    const statusSubject = new BehaviorSubject<string>('offline');
    const statusRef = ref(this.db, `/status/${uid}`);

    onValue(statusRef, (snapshot) => {
      const status = snapshot.val() ? snapshot.val().state : 'offline';
      statusSubject.next(status);
    });

    return statusSubject;
  }

  /**
  * Directly sets a guest user's status to 'offline'.
  * @param {string} uid - The guest user's unique identifier.
  */
  async setGuestOfflineDirectly(uid: string): Promise<void> {
    const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);
    await set(userStatusDatabaseRef, {
      state: 'offline',
      last_changed: serverTimestamp(),
    });
    this.stopTracking();
  }

  /**
  * Updates a guest user's status.
  * @param {string} uid - The guest user's unique identifier.
  * @param {string} status - The new status for the guest user.
  */
  async updateGuestStatus(uid: string, status: string): Promise<void> {
    const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);
    const statusForDatabase = {
      state: status,
      last_changed: serverTimestamp(),
    };

    await set(userStatusDatabaseRef, statusForDatabase).catch((error) =>
      console.error(error)
    );
  }

  /**
  * Starts tracking guest user activity.
  */
  startGuestTracking(): void {
    this.trackingEnabled = true;
    this.addActivityListeners();
  }

  /**
  * Stops tracking user activity and removes activity listeners.
  */
  stopTracking(): void {
    this.removeActivityListeners();
    this.trackingEnabled = false;
  }

  /**
  * Cleans up by removing activity listeners when the service is destroyed.
  */
  ngOnDestroy(): void {
    if (this.isPlatformBrowser()) {
      this.removeActivityListeners();
    }
  }
}
