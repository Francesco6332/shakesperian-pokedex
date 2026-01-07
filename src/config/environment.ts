export type StorageProvider = 'local' | 'firebase_storage';

export interface EnvironmentConfig {
    storage: {
        provider: StorageProvider;
    };
    
    firebase: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId: string;
    };
}

const defaultConfig: EnvironmentConfig = {
    storage: {
        provider: 'local',
    },
    firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
        measurementId: '',
    },
}

export function loadEnvironmentConfig(): EnvironmentConfig {
    return {
        storage: {
            provider: (import.meta.env.VITE_STORAGE_PROVIDER as StorageProvider) || defaultConfig.storage.provider,
        },
        firebase: {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.firebase.apiKey,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.firebase.authDomain,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.firebase.projectId,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.firebase.storageBucket,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.firebase.messagingSenderId,
            appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.firebase.appId,
            measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.firebase.measurementId,
        },
    }
}

export function validateFirebaseConfig(config: EnvironmentConfig['firebase']): {
    isValid: boolean;
    missingFields: string[];
} {
    const requiredFields: (keyof EnvironmentConfig['firebase'])[] = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId',
        'measurementId',
    ]; 

    const missingFields = requiredFields.filter(field => !config[field]);

    return {
        isValid: missingFields.length === 0,
        missingFields,
    }
}

export const envConfig = loadEnvironmentConfig();
export const configStatus = {
    firebase: validateFirebaseConfig(envConfig.firebase),
}
