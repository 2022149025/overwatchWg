import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  currentPage: 'home' | 'matchmaking' | 'profile' | 'notifications';
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout, currentPage }) => {
  return (
    <nav className="bg-gray-800 shadow-md p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-blue-400">
          <Link to="/main/matchmaking" className="hover:text-blue-300">
            오버워치 친구 찾기
          </Link>
        </h1>
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
            {isLoggedIn ? (
              <Button variant="ghost" onClick={onLogout} size="sm" className="!py-1.5 !px-3">
                로그아웃
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="!py-1.5 !px-3">
                  로그인
                </Button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;