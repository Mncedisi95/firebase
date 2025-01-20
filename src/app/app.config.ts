import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {provideAuth, getAuth} from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {provideStorage, getStorage} from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const firebaseConfig = {
  apiKey: "AIzaSyCu2ffgdrqfm0zn8L5dMPW689ikj3z-8oQ",
  authDomain: "fir-6122b.firebaseapp.com",
  projectId: "fir-6122b",
  storageBucket: "fir-6122b.firebasestorage.app",
  messagingSenderId: "723374731719",
  appId: "1:723374731719:web:7a15b1f9a200fd36b629e2",
  measurementId: "G-CZWRZY5B70"
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()), provideAnimationsAsync(),
  ]
};
