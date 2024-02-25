import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Database,
  objectVal,
  set,
  ref,
  onDisconnect,
  serverTimestamp,
  onValue,
} from '@angular/fire/database';
import { first } from 'rxjs/operators';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  constructor(
    private auth: Auth,
    private db: Database,
    private userService: UserService
  ) {
    this.updateOnDisconnect();
  }

  async updateOnUserLogin(uid: string) {
    //Status des Benutzers in der Realtime Database erstellen.
    const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);

    // Objekt für den Online-Status und serverseitiger Timestamp.
    const isOnlineForDatabase = {
      state: 'online',
      last_changed: serverTimestamp(),
    };

    // Den Benutzerstatus auf online machen.
    await set(userStatusDatabaseRef, isOnlineForDatabase);

    await this.userService.updateUserStatusByUid(uid, 'online');

    const connectedRef = ref(this.db, '.info/connected');
    objectVal(connectedRef).subscribe((connected) => {
      if (connected === false) {
        return;
      }

      //Wenn verbunden ist dann die onDisconnect()-Methode verwenden, um den Offline-Status zu setzen,
      // diese wird dann ausgeführt sobald die verbindung verlorene geht z.b wenn das fenseter geschlossen wird.
      onDisconnect(userStatusDatabaseRef).set({
        state: 'offline',
        last_changed: serverTimestamp(),
      });
    });
  }

  // funktion die den Online-/Offline-Status des Users beim Trennen der Verbindung aktualisiert.
  async updateOnDisconnect() {
    const user = await authState(this.auth).pipe(first()).toPromise();
    if (user) {
      const uid = user.uid;
      // In Users den status ändern .... geht nur für login und logout nicht bei schließen des fensters
      const userStatusDatabaseRef = ref(this.db, `/status/${uid}`);

      await this.userService.updateUserStatusByUid(uid, 'offline');

      const isOfflineForDatabase = {
        state: 'offline',
        last_changed: serverTimestamp(),
      };

      const isOnlineForDatabase = {
        state: 'online',
        last_changed: serverTimestamp(),
      };

      // Referenz für den real-time database Pfad .info/connected der true zurückgibt, wenn man verbunden.
      const connectedRef = ref(this.db, '.info/connected');
      objectVal(connectedRef).subscribe((connected) => {
        if (connected === false) {
          return;
        }

        // hier auch  die onDisconnect()-Methode verwenden, um den Offline-Status zu setzen,
        // sobald der User die Verbindung verliert.
        onDisconnect(userStatusDatabaseRef)
          .set(isOfflineForDatabase)
          .then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);
          });
      });
    }
  }

  //Holt sich den state/status aus der real-time db 
  getUserStatus(uid: string): BehaviorSubject<string> {
    const statusSubject = new BehaviorSubject<string>('offline');
    const statusRef = ref(this.db, `/status/${uid}`);

    onValue(statusRef, (snapshot: any) => { 
      const status = snapshot.val() ? snapshot.val().state : 'offline';
      statusSubject.next(status);
    }, {
      onlyOnce: false
    });

    return statusSubject;
  }
}

