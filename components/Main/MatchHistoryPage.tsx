import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserMatches, updateMatchStatus } from '../../services/matchingService';
import Button from '../Button';
import DOMPurify from 'dompurify';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  match_score: number;
  match_explanation: string;
  user1_status: string;
  user2_status: string;
  user1_discord_shared: boolean;
  user2_discord_shared: boolean;
  created_at: string;
  user1: any;
  user2: any;
}

const MatchHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;

    try {
      const data = await getUserMatches(user.id);
      setMatches(data || []);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };



  const getMatchedUser = (match: Match) => {
    return match.user1_id === user?.id ? match.user2 : match.user1;
  };



  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">매칭 히스토리</h2>
        <p className="text-center text-gray-300">로딩 중...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">매칭 히스토리</h2>
        <p className="text-center text-gray-300">아직 매칭 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">매칭 히스토리</h2>
      
      <div className="space-y-6">
        {matches.map((match) => {
          const matchedUser = getMatchedUser(match);

          return (
            <div
              key={match.id}
              className="bg-gray-700 rounded-lg p-6 border-2 border-green-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={matchedUser.profile_picture || 'https://picsum.photos/80/80'}
                    alt={matchedUser.nickname}
                    className="w-16 h-16 rounded-full border-2 border-blue-500"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{matchedUser.nickname}</h3>
                    <p className="text-gray-400 text-sm">
                      {matchedUser.mbti} | {matchedUser.hero}
                    </p>
                    <p className="text-blue-300 text-sm">
                      매칭 점수: {Math.round(match.match_score * 100)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">
                    {new Date(match.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              {match.match_explanation && (
                <div className="bg-blue-900 border border-blue-500 rounded-lg p-3 mb-4">
                  <p className="text-blue-200 text-sm font-semibold mb-1">🤖 AI 매칭 분석</p>
                  <p 
                    className="text-blue-100 text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(match.match_explanation) 
                    }}
                  />
                </div>
              )}

              {/* 디스코드 ID 표시 */}
              {(() => {
                const isUser1 = match.user1_id === user?.id;
                const myUser = isUser1 ? match.user1 : match.user2;
                const otherUser = matchedUser;
                const myDiscordId = myUser.discord_id;
                const otherDiscordId = otherUser.discord_id;

                // 양쪽 모두 디스코드 ID가 있는 경우
                if (myDiscordId && otherDiscordId) {
                  return (
                    <div className="bg-green-900 border border-green-500 rounded-lg p-4">
                      <p className="text-green-200 text-sm font-semibold mb-3 text-center">💬 디스코드로 연락하세요!</p>
                      <div className="space-y-2">
                        <div className="bg-gray-800 rounded p-3">
                          <p className="text-gray-400 text-xs mb-1">내 디스코드 ID</p>
                          <p className="text-white font-mono text-base">{myDiscordId}</p>
                        </div>
                        <div className="bg-gray-800 rounded p-3">
                          <p className="text-gray-400 text-xs mb-1">{otherUser.nickname}님의 디스코드 ID</p>
                          <p className="text-white font-mono text-base">{otherDiscordId}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 한쪽만 디스코드 ID가 있는 경우
                if (myDiscordId || otherDiscordId) {
                  return (
                    <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                      <p className="text-yellow-200 text-sm font-semibold mb-3 text-center">⚠️ 디스코드 ID 설정 필요</p>
                      <div className="space-y-2">
                        {myDiscordId && (
                          <div className="bg-gray-800 rounded p-3">
                            <p className="text-gray-400 text-xs mb-1">내 디스코드 ID</p>
                            <p className="text-white font-mono text-base">{myDiscordId}</p>
                          </div>
                        )}
                        {otherDiscordId && (
                          <div className="bg-gray-800 rounded p-3">
                            <p className="text-gray-400 text-xs mb-1">{otherUser.nickname}님의 디스코드 ID</p>
                            <p className="text-white font-mono text-base">{otherDiscordId}</p>
                          </div>
                        )}
                        <p className="text-yellow-300 text-xs text-center mt-2">
                          {!myDiscordId && '프로필에서 디스코드 ID를 설정해주세요'}
                          {!otherDiscordId && '상대방이 디스코드 ID를 설정하지 않았습니다'}
                        </p>
                      </div>
                    </div>
                  );
                }

                // 양쪽 모두 디스코드 ID가 없는 경우
                return (
                  <div className="bg-red-900 border border-red-600 rounded-lg p-3">
                    <p className="text-red-200 text-sm text-center">
                      ❌ 양쪽 모두 디스코드 ID가 설정되지 않았습니다
                    </p>
                    <p className="text-red-300 text-xs text-center mt-2">
                      프로필 페이지에서 디스코드 ID를 설정해주세요
                    </p>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchHistoryPage;
