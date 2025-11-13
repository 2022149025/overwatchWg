import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  match_id: string | null;
  is_read: boolean;
  created_at: string;
}

export function useRealtimeNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // 초기 알림 로드
    loadNotifications();

    // Realtime 구독
    const channel: RealtimeChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New notification:', payload);
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          // 브라우저 알림 표시
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/overwatch-icon.png',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const loadNotifications = async () => {
    if (!userId) {
      console.log('useRealtimeNotifications: No userId provided');
      return;
    }

    console.log('useRealtimeNotifications: Loading notifications for user:', userId);

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading notifications:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('useRealtimeNotifications: Loaded notifications:', data);
    setNotifications(data || []);
    setUnreadCount(data?.filter((n) => !n.is_read).length || 0);
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  // 브라우저 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    requestNotificationPermission,
    refreshNotifications: loadNotifications,
  };
}
