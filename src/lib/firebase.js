import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import logger from "@/utils/logger";

// Aggressive cleaning function for environment variables
const cleanEnvVar = (val) => {
  if (typeof val !== 'string') return val;
  // Remove ALL whitespace, newlines, carriage returns, and control characters
  return val.replace(/[\s\n\r\t]/g, '').trim();
};

const firebaseConfig = {
  apiKey: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
};

// Initialize Firebase
let app = null;
let messaging = null;

try {
  const isConfigValid = firebaseConfig.projectId && 
                       firebaseConfig.apiKey && 
                       firebaseConfig.apiKey !== 'your_firebase_api_key' &&
                       !firebaseConfig.apiKey.includes('undefined');

  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
    const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
    
    // Messaging service
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      messaging = getMessaging(app);
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Firebase] Configuration incomplete or invalid:', {
        hasProjectId: !!firebaseConfig.projectId,
        hasApiKey: !!firebaseConfig.apiKey,
        hasAppId: !!firebaseConfig.appId,
        isDefaultKey: firebaseConfig.apiKey === 'your_firebase_api_key',
        containsUndefined: String(firebaseConfig.apiKey).includes('undefined') || String(firebaseConfig.appId).includes('undefined')
      });
      console.warn('[Firebase] Notifications will be disabled. Please check Vercel environment variables including NEXT_PUBLIC_FIREBASE_APP_ID.');
    }
  }
} catch (error) {
  logger.error('Firebase initialization failed', error);
}

export { messaging };

export const requestForToken = async () => {
  try {
    const vapidKey = (process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '').trim();
    
    // Validate VAPID key before use
    if (!vapidKey || vapidKey === 'your_vapid_key' || vapidKey.length < 50) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('Invalid or missing VAPID key. Notifications disabled.');
      }
      return null;
    }

    // atob safety check: ensuring it's valid base64url or base64
    try {
      if (typeof window !== 'undefined') {
        window.atob(vapidKey.replace(/-/g, '+').replace(/_/g, '/'));
      }
    } catch (e) {
      console.error('VAPID key is not correctly base64 encoded:', e.message);
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey
    });
    if (currentToken) {
      // console.log('Current FCM token:', currentToken);
      return currentToken;
    } else {
      console.warn('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    if (err.message?.includes('installations/request-failed')) {
      console.error('[Firebase] Installations 400 Error detected! This usually means the App ID or API Key in Vercel environment variables does not match the actual Firebase project "shwapner-thikana-ltd".');
      console.warn('[Firebase] Current Config Diagnostics:', {
        projectId: firebaseConfig.projectId,
        messagingSenderId: firebaseConfig.messagingSenderId,
        appId: firebaseConfig.appId,
        apiKey: firebaseConfig.apiKey ? 'Present (First 5: ' + firebaseConfig.apiKey.substring(0, 5) + '...)' : 'Missing'
      });
      console.warn('[Firebase] Troubleshooting: 1. Confirm NEXT_PUBLIC_FIREBASE_APP_ID is correct. 2. Ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID matches the project ID in your Firebase Console.');
    } else {
      console.error('An error occurred while retrieving token. ', err);
    }
  }
};

export const onMessageListener = (callback) => {
  if (messaging) {
    return onMessage(messaging, (payload) => {
      // console.log("Foreground Message received:", payload);
      callback(payload);
    });
  }
};
