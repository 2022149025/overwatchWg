import React, { useEffect } from 'react';
import { Notification } from '../../types';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications';

interface NotificationsPageProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications: legacyNotifications,
  onMarkAsRead: legacyMarkAsRead,
  onClearAll: legacyClearAll,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const {
    notifications: realtimeNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    requestNotificationPermission,
  } = useRealtimeNotifications(user?.id);

  useEffect(() => {
    // 브라우저 알림 권한 요청
    requestNotificationPermission();
    
    // 로딩 상태 관리
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('NotificationsPage: user', user);
    console.log('NotificationsPage: realtimeNotifications', realtimeNotifications);
    console.log('NotificationsPage: legacyNotifications', legacyNotifications);
  }, [user, realtimeNotifications, legacyNotifications]);

  // Realtime 알림 우선 사용, 없으면 legacy 알림 사용
  const displayNotifications = realtimeNotifications.length > 0 
    ? realtimeNotifications.map(n => ({
        id: n.id,
        type: n.type,
        message: n.message,
        timestamp: n.created_at,
        isRead: n.is_read,
        matchedUserId: n.match_id,
      }))
    : legacyNotifications;

  const handleNotificationClick = (notification: Notification) => {
    if (realtimeNotifications.length > 0) {
      markAsRead(notification.id);
    } else {
      legacyMarkAsRead(notification.id);
    }
    
    // 매칭 관련 알림이면 매칭 진행 페이지로 이동
    if (notification.type === 'match_found' || notification.type.includes('match')) {
      navigate('/main/matchmaking');
    }
  };

  const handleClearAll = () => {
    if (realtimeNotifications.length > 0) {
      markAllAsRead();
    } else {
      legacyClearAll();
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">알림</h2>
        <p className="text-gray-300">알림을 불러오는 중...</p>
      </div>
    );
  }

  if (displayNotifications.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">알림</h2>
        <p className="text-gray-300">새로운 알림이 없습니다.</p>
        {user && (
          <p className="text-gray-400 text-sm mt-2">User ID: {user.id}</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-400">
          알림 {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
        </h2>
        {displayNotifications.length > 0 && (
          <Button onClick={handleClearAll} variant="secondary" className="!text-sm !py-2 !px-3">
            모두 읽음
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {displayNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg flex items-center justify-between transition-colors duration-200 ${
              notification.isRead ? 'bg-gray-700 text-gray-400' : 'bg-blue-600 text-white shadow-md'
            } cursor-pointer hover:bg-opacity-80`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex-grow">
              <p className="font-semibold">{notification.message}</p>
              <p className="text-xs mt-1">
                {new Date(notification.timestamp).toLocaleString('ko-KR')}
              </p>
            </div>
            {!notification.isRead && (
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-4"></span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <Button variant="outline" onClick={handleClearAll}>
          모든 알림 지우기
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPage;