import { useState, useEffect, useCallback } from 'react';

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        default: currentPermission === 'default'
      });
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported || permission.granted) {
      return permission.granted;
    }

    try {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';
      
      setPermission({
        granted,
        denied: result === 'denied',
        default: result === 'default'
      });

      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported, permission.granted]);

  const sendNotification = useCallback(async (options: NotificationOptions): Promise<boolean> => {
    if (!permission.granted) {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    try {
      // Use service worker for better notification management
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/lovable-uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png',
          badge: options.badge || '/lovable-uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png',
          tag: options.tag,
          renotify: options.renotify,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
          vibrate: options.vibrate || [200, 100, 200],
          actions: options.actions,
          data: {
            url: window.location.origin,
            timestamp: Date.now()
          }
        } as any);
      } else {
        // Fallback to regular notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/lovable-uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png',
          tag: options.tag,
          renotify: options.renotify,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
          vibrate: options.vibrate || [200, 100, 200]
        } as any);
      }

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }, [permission.granted, requestPermission]);

  const scheduleReminder = useCallback((
    delay: number, 
    options: NotificationOptions
  ): NodeJS.Timeout => {
    return setTimeout(() => {
      sendNotification({
        ...options,
        tag: 'therapy-reminder',
        requireInteraction: true,
        actions: [
          {
            action: 'start-session',
            title: 'Start Session',
            icon: '/lovable-uploads/b956bdcc-9ea9-4d25-9016-b4e126858282.png'
          },
          {
            action: 'snooze',
            title: 'Remind Later'
          }
        ]
      });
    }, delay);
  }, [sendNotification]);

  const scheduleDailyReminder = useCallback((
    hour: number,
    minute: number,
    options: NotificationOptions
  ) => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();
    
    return scheduleReminder(delay, {
      ...options,
      tag: 'daily-reminder'
    });
  }, [scheduleReminder]);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    scheduleReminder,
    scheduleDailyReminder
  };
}