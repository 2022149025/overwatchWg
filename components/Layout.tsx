import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from './Button';
import '../styles/components/layout.css';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  onLogout: () => void;
  currentPage?: 'home' | 'matchmaking' | 'profile' | 'notifications';
}

const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn, onLogout, currentPage }) => {
  const location = useLocation();
  const isPersonaTestPage = location.pathname.startsWith('/persona-test');
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="ow-layout min-h-screen flex flex-col bg-gray-900 text-white">
      {!(isPersonaTestPage || isAuthPage) && (
        <header className="bg-gray-800 shadow-md p-4 sticky top-0 z-10">
          <div className="ow-container container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-blue-400">
              <Link to="/main/matchmaking" className="hover:text-blue-300">
                오버워치 친구 찾기
              </Link>
            </h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    to="/main/matchmaking"
                    className={`text-lg font-medium hover:text-blue-400 ${
                      currentPage === 'matchmaking' ? 'text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    매칭 진행
                  </Link>
                </li>
                <li>
                  <Link
                    to="/main/profile"
                    className={`text-lg font-medium hover:text-blue-400 ${
                      currentPage === 'profile' ? 'text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    프로필
                  </Link>
                </li>
                <li>
                  <Link
                    to="/main/notifications"
                    className={`text-lg font-medium hover:text-blue-400 ${
                      currentPage === 'notifications' ? 'text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    알림
                  </Link>
                </li>
                <li>
                  <Link
                    to="/main/history"
                    className="text-lg font-medium hover:text-blue-400 text-gray-300"
                  >
                    히스토리
                  </Link>
                </li>
                <li>
                  {isLoggedIn ? (
                    <Button variant="ghost" onClick={onLogout} size="sm" className="!py-1.5 !px-3 !text-sm !min-w-0 !w-auto !h-auto">
                      로그아웃
                    </Button>
                  ) : (
                    <Link to="/auth">
                      <Button variant="ghost" size="sm" className="!py-1.5 !px-3 !text-sm !min-w-0 !w-auto !h-auto">
                        로그인
                      </Button>
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </header>
      )}

      <main className="ow-container flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;