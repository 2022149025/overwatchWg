import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PersonaTestPage from './components/PersonaTest/PersonaTestPage';
import AuthPage from './components/Auth/AuthPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import DebugPage from './components/Debug/DebugPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './components/Main/MainPage';
import Layout from './components/Layout';
import { UserProfile } from './types';
import { DUMMY_USER_PROFILE } from './constants';
import './styles/overwatch-theme.css';
import './styles/components/typography.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Initial check for login state and user profile in localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      setIsLoggedIn(true);
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        // If logged in but no profile, use dummy profile and save it
        setUserProfile(DUMMY_USER_PROFILE);
        localStorage.setItem('userProfile', JSON.stringify(DUMMY_USER_PROFILE));
      }
    }
  }, []);

  const handleLogin = (user: UserProfile) => {
    setIsLoggedIn(true);
    setUserProfile(user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userProfile', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    window.location.hash = '/auth'; // Redirect to login page
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  const AppRoutes = () => {
    const navigate = useNavigate();
    const location = window.location.hash;

    useEffect(() => {
      // Redirect based on login status on initial load
      if (!isLoggedIn) {
        if (!location.startsWith('#/persona-test') && location !== '#/auth') {
          // If not logged in and not on persona test or auth, go to persona test
          // If a persona test result exists but not logged in, go to auth.
          if (localStorage.getItem('personaTestResult')) {
            navigate('/auth');
          } else {
            navigate('/persona-test');
          }
        }
      } else {
        // If logged in and on persona test or auth, redirect to main page
        if (location.startsWith('#/persona-test') || location === '#/auth' || location === '#/') {
          navigate('/main/matchmaking');
        }
      }
    }, [isLoggedIn, navigate, location]);

    const getPageIdentifier = (): 'matchmaking' | 'profile' | 'notifications' | undefined => {
      if (location.includes('matchmaking')) return 'matchmaking';
      if (location.includes('profile')) return 'profile';
      if (location.includes('notifications')) return 'notifications';
      return undefined;
    };

    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} currentPage={getPageIdentifier()}>
        <Routes>
          <Route path="/persona-test" element={<PersonaTestPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          {isLoggedIn ? (
            <Route path="/main/*" element={<MainPage userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />} />
          ) : (
            // Fallback for not logged in, should be redirected by useEffect
            <Route path="*" element={<AuthPage />} />
          )}
        </Routes>
      </Layout>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;