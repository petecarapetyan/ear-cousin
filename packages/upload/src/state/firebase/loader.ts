import { initializeApp, FirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { config } from './config'
export type Firebase = typeof import('firebase/app')
declare global {
  interface Window {
    firebase: Firebase
  }
}

const firebaseApp: FirebaseApp = initializeApp(config);
export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp);
export const db = getFirestore();