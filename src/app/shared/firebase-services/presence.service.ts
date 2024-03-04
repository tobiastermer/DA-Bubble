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

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private timeoutID: any;
  private inactivityTimeout: any;

  constructor(
    private auth: Auth,
    private db: Database,
    private userService: UserService
  ) {
    this.initPresence();
  }

  //Intialisierung des derzeitigen Status
  private initPresence(): void {
    this.updateOnDisconnect();
    if (this.isPlatformBrowser()) {
      this.addActivityListeners();
    }
  }

  private isPlatformBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Status aktuallisierung im Realtime Speicher
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

  //setzt den Aktivitätsstatus zurück
  private resetTimer(): void {
    authState(this.auth)
      .pipe(first())
      .toPromise()
      .then((user) => {
        if (user) {
          this.startInactivityTimer(user.uid);
          this.setUserStatus(user.uid, 'online');
        }
      });
  }

  // startet den inactivitätsstatus ab 2min
  private startInactivityTimer(uid: string): void {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => this.setUserStatus(uid, 'away'), 60000);
  }

  //maus/tastatur kontrolle
  private addActivityListeners(): void {
    const resetTimerBound = this.resetTimer.bind(this);
    window.addEventListener('mousemove', resetTimerBound);
    window.addEventListener('keydown', resetTimerBound);
  }

  private removeActivityListeners(): void {
    const resetTimerBound = this.resetTimer.bind(this);
    window.removeEventListener('mousemove', resetTimerBound);
    window.removeEventListener('keydown', resetTimerBound);
  }

  // ändern des statuses zu online bei Login
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
  }

  //setzt den Status auf offline bei fensterschließung
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

  //status auf offline setzen bei logout
  async updateOnDisconnect(): Promise<void> {
    const user = await authState(this.auth).pipe(first()).toPromise();
    const guestUid = 't8WOIhqo9BYogI9FmZhtCHP7K3t1'; // Die UID des Gastkontos

    if (user) {
      const uid = user.uid;
      // Überprüfen, ob der Benutzer der Gastbenutzer ist
      if (uid === guestUid) {
        await this.setGuestOfflineDirectly(guestUid);
      } else {
        const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);
        await this.setUserStatus(uid, 'offline');
        this.monitorConnection(userStatusDatabaseRef);
      }
    }
  }

  //geht nicht !
  async setGuestOfflineDirectly(uid: string): Promise<void> {
    const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);
    await set(userStatusDatabaseRef, {
      state: 'offline',
      last_changed: serverTimestamp(),
    });
    await this.setUserStatus(uid, 'offline');
  }

  //funktion zu abfragen den aktuellen Statuses
  getUserStatus(uid: string): BehaviorSubject<string> {
    const statusSubject = new BehaviorSubject<string>('offline');
    const statusRef = ref(this.db, `/status/${uid}`);

    onValue(statusRef, (snapshot) => {
      const status = snapshot.val() ? snapshot.val().state : 'offline';
      statusSubject.next(status);
    });

    return statusSubject;
  }

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

  ngOnDestroy(): void {
    if (this.isPlatformBrowser()) {
      this.removeActivityListeners();
    }
  }
}
