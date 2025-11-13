import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PersonaTestResult } from '../../types';
import Button from '../Button';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [personaResult, setPersonaResult] = useState<PersonaTestResult | null>(null);

  useEffect(() => {
    // Load persona test result from localStorage
    const storedResult = localStorage.getItem('personaTestResult');
    if (storedResult) {
      setPersonaResult(JSON.parse(storedResult));
    }
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8E4F3] to-[#D4E4F7] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="ow-heading-h1 mb-2">대시보드</h1>
              <p className="text-gray-600">환영합니다, {user?.email}!</p>
            </div>
            <Button variant="secondary" onClick={handleSignOut} className="!text-base">
              로그아웃
            </Button>
          </div>
        </div>

        {/* Persona Result */}
        {personaResult && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="ow-heading-h2 mb-4">나의 페르소나</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">MBTI</p>
                <p className="text-2xl font-bold text-[#FA9C1D]">{personaResult.mbti}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">오버워치 영웅</p>
                <p className="text-2xl font-bold text-[#FA9C1D]">{personaResult.hero}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">선호 역할</p>
                <p className="text-xl font-semibold">
                  {personaResult.preferredRoles?.join(', ') || '미설정'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">선호 티어</p>
                <p className="text-xl font-semibold">
                  {personaResult.preferredTiers?.join(', ') || '미설정'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="ow-heading-h2 mb-4">기능</h2>
          <div className="space-y-3">
            <Button variant="primary" className="w-full !text-lg">
              친구 찾기
            </Button>
            <Button variant="secondary" className="w-full !text-lg">
              내 프로필 수정
            </Button>
            <Button variant="outline" className="w-full !text-lg" onClick={() => navigate('/persona-test')}>
              페르소나 테스트 다시하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
