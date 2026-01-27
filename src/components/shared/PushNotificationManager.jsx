'use client';

import React, { useEffect } from 'react';
import { requestForToken, onMessageListener } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const PushNotificationManager = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const setupPush = async () => {
        try {
          const token = await requestForToken();
          if (token) {
            // Register token with backend
            await api.notifications.registerFcmToken(token);
          }
        } catch (err) {
          console.error('Error setting up push notifications:', err);
        }
      };

      setupPush();
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onMessageListener((payload) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-zinc-900 border border-brand-gold/30 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <span className="font-bold">🔔</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-zinc-100 italic">
                  {payload.notification?.title || 'New Notification'}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {payload.notification?.body}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-white/5">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                if (payload.data?.link) window.location.href = payload.data.link;
              }}
              className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-xs font-bold text-brand-gold hover:text-brand-gold-light focus:outline-none"
            >
              View
            </button>
          </div>
        </div>
      ), { duration: 8000 });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default PushNotificationManager;
