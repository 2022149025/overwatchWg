import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { upsertUserProfile } from '../../services/matchingService';
import Button from '../Button';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [discordId, setDiscordId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          // Set legacy login state for compatibility
          localStorage.setItem('isLoggedIn', 'true');
          
          // Get current user from Supabase
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Check if persona test result exists
            const personaResult = localStorage.getItem('personaTestResult');
            const pendingDiscordId = localStorage.getItem('pendingDiscordId') || '';
            
            if (personaResult) {
              const result = JSON.parse(personaResult);
              const userProfile = {
                id: user.id,
                nickname: email.split('@')[0],
                bio: '',
                profilePicture: '',
                mbti: result.mbti,
                hero: result.hero,
                mainRole: result.preferredRoles?.[0] || 'ALLROUNDER',
                preferredTanks: [],
                preferredDamage: [],
                preferredSupports: [],
                maxTiers: {},
                preferredTeammateCommunication: result.preferredTeammateCommunication,
                selfCommunicationStyle: result.selfCommunicationStyle,
                teammatePreference: result.teammatePreference,
                discordId: pendingDiscordId,
              };
              
              // Save to Supabase
              try {
                await upsertUserProfile(userProfile);
                console.log('User profile saved to Supabase');
              } catch (err) {
                console.error('Failed to save profile to Supabase:', err);
              }
              
              // Save to localStorage for compatibility
              localStorage.setItem('userProfile', JSON.stringify(userProfile));
              localStorage.removeItem('pendingDiscordId');
            }
          }
          
          // Reload to trigger App.tsx routing logic
          window.location.hash = '/main/matchmaking';
          window.location.reload();
        }
      } else {
        // Sign up
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          // Save discord ID to localStorage for later use
          if (discordId.trim()) {
            localStorage.setItem('pendingDiscordId', discordId);
          }
          
          setSuccessMessage('회원가입이 완료되었습니다! 이메일을 확인 후 로그인해주세요.');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setDiscordId('');
        }
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8E4F3] to-[#D4E4F7] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="ow-heading-h1 text-center mb-2">
          {showForm ? (isLogin ? '로그인' : '회원가입') : '환영합니다!'}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          오버워치 게임 친구 찾기
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {!showForm ? (
          <div className="space-y-4">
            <Button
              onClick={() => {
                setIsLogin(false);
                setShowForm(true);
              }}
              variant="primary"
              className="w-full !text-xl"
            >
              이메일로 회원가입하기
            </Button>
            <Button
              onClick={() => {
                setIsLogin(true);
                setShowForm(true);
              }}
              variant="secondary"
              className="w-full !text-xl"
            >
              이메일로 로그인하기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA9C1D] focus:border-transparent text-gray-900 bg-white"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA9C1D] focus:border-transparent text-gray-900 bg-white"
              placeholder="최소 6자 이상"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA9C1D] focus:border-transparent text-gray-900 bg-white"
                  placeholder="비밀번호 재입력"
                  required
                />
              </div>
              <div>
                <label htmlFor="discordId" className="block text-sm font-medium text-gray-700 mb-1">
                  디스코드 아이디 (선택사항)
                </label>
                <input
                  id="discordId"
                  type="text"
                  value={discordId}
                  onChange={(e) => setDiscordId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA9C1D] focus:border-transparent text-gray-900 bg-white"
                  placeholder="your_discord_id"
                />
                <p className="text-xs text-gray-500 mt-1">
                  매칭된 상대와 연락할 때 사용됩니다
                </p>
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full !text-xl"
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </Button>
          </form>
        )}

        {showForm && (
          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMessage('');
              }}
              className="text-[#FA9C1D] hover:underline block w-full"
            >
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setError('');
                setSuccessMessage('');
              }}
              className="text-gray-500 hover:underline block w-full text-sm"
            >
              ← 뒤로 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
