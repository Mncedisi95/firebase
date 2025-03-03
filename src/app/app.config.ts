import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp } from "firebase/app";
import {provideAuth, getAuth} from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {provideStorage, getStorage} from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu2ffgdrqfm0zn8L5dMPW689ikj3z-8oQ",
  authDomain: "fir-6122b.firebaseapp.com",
  projectId: "fir-6122b",
  storageBucket: "fir-6122b.firebasestorage.app",
  messagingSenderId: "723374731719",
  appId: "1:723374731719:web:7a15b1f9a200fd36b629e2",
  measurementId: "G-CZWRZY5B70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(),provideAnimationsAsync(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => app), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
};
