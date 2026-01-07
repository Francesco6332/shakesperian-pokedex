import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { envConfig, configStatus } from './environment';

const isFirebaseConfigured = configStatus.firebase.isValid;

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

if (isFirebaseConfigured) {
    const firebaseConfig = {
        apiKey: envConfig.firebase.apiKey,
        authDomain: envConfig.firebase.authDomain,
        projectId: envConfig.firebase.projectId,
        storageBucket: envConfig.firebase.storageBucket,
        messagingSenderId: envConfig.firebase.messagingSenderId,
        appId: envConfig.firebase.appId,
        measurementId: envConfig.firebase.measurementId,
    };

    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    } catch (error) {
        console.error('Firebase initialization error:', error);
        console.warn('Firebase features will not be available. Using localStorage fallback.');
    }
} else {
    if (import.meta.env.DEV) {
        console.info('Firebase not configured. Missing fields:', configStatus.firebase.missingFields);
        console.info('App will use localStorage for favorites storage.');
        console.info('To enable Firebase, set the following environment variables:');
        console.info('- VITE_FIREBASE_API_KEY');
        console.info('- VITE_FIREBASE_AUTH_DOMAIN');
        console.info('- VITE_FIREBASE_PROJECT_ID');
        console.info('- VITE_FIREBASE_STORAGE_BUCKET');
        console.info('- VITE_FIREBASE_MESSAGING_SENDER_ID');
        console.info('- VITE_FIREBASE_APP_ID');
        console.info('- VITE_FIREBASE_MEASUREMENT_ID');
    }
}

export { app, db, isFirebaseConfigured };
export default app;