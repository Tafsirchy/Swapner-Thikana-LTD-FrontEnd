import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app = null;
let messaging = null;

try {
  if (firebaseConfig.projectId && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_api_key') {
    app = initializeApp(firebaseConfig);
    
    // Messaging service
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      messaging = getMessaging(app);
    }
  } else {
    console.warn('Firebase configuration missing or invalid. Notifications will be disabled.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { messaging };

export const requestForToken = async () => {
  try {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    
    // Validate VAPID key before use
    if (!vapidKey || vapidKey === 'your_vapid_key' || vapidKey.length < 50) {
      console.warn('Invalid or missing VAPID key. Notifications disabled.');
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
    console.error('An error occurred while retrieving token. ', err);
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
