import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { HashLocationStrategy, PathLocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: PathLocationStrategy, useClass: HashLocationStrategy },
    provideRouter(routes),

    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          apiKey: "AIzaSyCKCP3bAPvIbnc9CgLehl0BJXeSsvIouS4",
          authDomain: "da-bubble-own-dbdab.firebaseapp.com",
          projectId: "da-bubble-own-dbdab",
          storageBucket: "da-bubble-own-dbdab.appspot.com",
          messagingSenderId: "334173287276",
          appId: "1:334173287276:web:4d295db0d16232500eb949",      
          databaseURL:
            'https://da-bubble-own-dbdab-default-rtdb.europe-west1.firebasedatabase.app',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(provideDatabase(() => getDatabase())),
  ],
};
