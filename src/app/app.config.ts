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
    {provide : PathLocationStrategy , useClass : HashLocationStrategy},
    provideRouter(routes),

    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'da-bubble-6e91a',
          appId: '1:435601506485:web:dd5dd78a239840fbb7fefc',
          storageBucket: 'da-bubble-6e91a.appspot.com',
          apiKey: 'AIzaSyCrYeJXl3oqlWCfl7NjrLX9lDvHzhuPg5I',
          authDomain: 'da-bubble-6e91a.firebaseapp.com',
          messagingSenderId: '435601506485',
          databaseURL:
            'https://da-bubble-6e91a-default-rtdb.europe-west1.firebasedatabase.app',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    importProvidersFrom(provideDatabase(() => getDatabase())),
  ],
};
