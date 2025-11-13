import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MatchmakingPage from './MatchmakingPage';
import ProfilePage from './ProfilePage';
import NotificationsPage from './NotificationsPage';
import MatchHistoryPage from './MatchHistoryPage';
import { UserProfile, MatchedUser, Notification } from '../../types';
import { DUMMY_USER_PROFILE, DUMMY_NOTIFICATIONS } from '../../constants';

interface MainPageProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (user: UserProfile) => void;
}

const MainPage: React.FC<MainPageProps> = ({ userProfile, onUpdateProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentMatchedUser, setCurrentMatchedUser] = useState<MatchedUser | null>(null);

  // Initial check for notifications from localStorage
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      // FIX: Ensure the parsed data from localStorage is correctly typed as Notification[]
      // The `DUMMY_NOTIFICATIONS` array was explicitly typed in constants.ts to resolve
      // the `type` property compatibility issue. Now JSON.parse will be correctly inferred
      // or should be cast if there's a risk of incorrect data. For this case, it's safer
      // to assume the stored format matches the Notification type due to prior initialization.
      setNotifications(JSON.parse(storedNotifications) as Notification[]);
    } else {
      setNotifications(DUMMY_NOTIFICATIONS);
      localStorage.setItem('notifications', JSON.stringify(DUMMY_NOTIFICATIONS));
    }
  }, []);

  // Update localStorage when notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);


  const handleNewMatchFound = (matchedUser: MatchedUser) => {
    setCurrentMatchedUser(matchedUser);
  };

  const handleClearMatch = () => {
    setCurrentMatchedUser(null);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const getPageIdentifier = (): 'matchmaking' | 'profile' | 'notifications' => {
    if (location.pathname.includes('matchmaking')) return 'matchmaking';
    if (location.pathname.includes('profile')) return 'profile';
    if (location.pathname.includes('notifications')) return 'notifications';
    return 'matchmaking'; // Default
  };

  return (
    <div className="main-page ow-layout">
      <Routes>
        <Route
          path="matchmaking"
          element={
            <MatchmakingPage
              userProfile={userProfile}
              onNewMatchFound={handleNewMatchFound}
              currentMatchedUser={currentMatchedUser}
              onClearMatch={handleClearMatch}
            />
          }
        />
        <Route
          path="profile"
          element={<ProfilePage userProfile={userProfile} onUpdateProfile={onUpdateProfile} />}
        />
        <Route
          path="notifications"
          element={
            <NotificationsPage
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onClearAll={handleClearAllNotifications}
            />
          }
        />
        <Route path="history" element={<MatchHistoryPage />} />
        {/* Redirect to matchmaking if root /main is accessed */}
        <Route path="/" element={<MatchmakingPage
              userProfile={userProfile}
              onNewMatchFound={handleNewMatchFound}
              currentMatchedUser={currentMatchedUser}
              onClearMatch={handleClearMatch}
            />} />
      </Routes>
    </div>
  );
};

export default MainPage;