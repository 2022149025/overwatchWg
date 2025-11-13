import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Button';

const DebugPage: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 프로필 조회 (RLS 때문에 자신의 것만 보임)
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*');
      setProfiles(profileData || []);

      // 대기열 조회
      const { data: queueData } = await supabase
        .from('matching_queue')
        .select('*');
      setQueue(queueData || []);

      // 매칭 조회
      const { data: matchData } = await supabase
        .from('matches')
        .select('*');
      setMatches(matchData || []);

      // 알림 조회
      const { data: notifData } = await supabase
        .from('notifications')
        .select('*');
      setNotifications(notifData || []);

      console.log('Debug Data:', {
        profiles: profileData,
        queue: queueData,
        matches: matchData,
        notifications: notifData,
      });
    } catch (error) {
      console.error('Error fetching debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearQueue = async () => {
    if (confirm('대기열을 모두 삭제하시겠습니까?')) {
      await supabase.from('matching_queue').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      fetchData();
    }
  };

  const clearMatches = async () => {
    if (confirm('매칭 기록을 모두 삭제하시겠습니까?')) {
      await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      fetchData();
    }
  };

  const createTestNotification = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'test',
        title: '테스트 알림',
        message: '이것은 테스트 알림입니다.',
        is_read: false,
      })
      .select();

    if (error) {
      console.error('Error creating test notification:', error);
      alert('알림 생성 실패: ' + error.message);
    } else {
      console.log('Test notification created:', data);
      alert('테스트 알림이 생성되었습니다!');
      fetchData();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">🔍 디버그 페이지</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        <Button onClick={fetchData} disabled={loading}>
          {loading ? '로딩 중...' : '새로고침'}
        </Button>
        <Button onClick={clearQueue} variant="secondary">
          대기열 초기화
        </Button>
        <Button onClick={clearMatches} variant="secondary">
          매칭 초기화
        </Button>
        <Button onClick={createTestNotification} className="bg-green-600 hover:bg-green-700">
          테스트 알림 생성
        </Button>
      </div>

      {user && (
        <div className="mb-6 p-4 bg-gray-700 rounded">
          <h3 className="text-lg font-bold text-white mb-2">현재 사용자</h3>
          <p className="text-gray-300">User ID: {user.id}</p>
          <p className="text-gray-300">Email: {user.email}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* 프로필 */}
        <div className="bg-gray-700 p-4 rounded">
          <h2 className="text-xl font-bold text-white mb-3">
            👤 사용자 프로필 ({profiles.length})
          </h2>
          {profiles.length === 0 ? (
            <p className="text-gray-400">프로필이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {profiles.map((profile) => (
                <div key={profile.id} className="bg-gray-600 p-3 rounded text-sm">
                  <p className="text-white font-semibold">{profile.nickname}</p>
                  <p className="text-gray-300">MBTI: {profile.mbti} | 영웅: {profile.hero}</p>
                  <p className="text-gray-400 text-xs">ID: {profile.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 대기열 */}
        <div className="bg-gray-700 p-4 rounded">
          <h2 className="text-xl font-bold text-white mb-3">
            ⏳ 매칭 대기열 ({queue.length})
          </h2>
          {queue.length === 0 ? (
            <p className="text-gray-400">대기 중인 사용자가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {queue.map((q) => {
                const isExpired = new Date(q.expires_at) < new Date();
                const isCurrentUser = q.user_id === user?.id;
                return (
                  <div 
                    key={q.id} 
                    className={`p-3 rounded text-sm ${
                      isExpired ? 'bg-red-900 border border-red-500' : 
                      isCurrentUser ? 'bg-blue-900 border border-blue-500' :
                      'bg-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <p className="text-white font-semibold">
                          User ID: {q.user_id.substring(0, 8)}...
                          {isCurrentUser && <span className="ml-2 text-blue-300">(나)</span>}
                        </p>
                        <p className="text-gray-300">
                          상태: <span className={q.status === 'waiting' ? 'text-yellow-300' : 'text-gray-400'}>
                            {q.status}
                          </span>
                        </p>
                        <p className="text-gray-300">
                          티어: {q.min_tier || '없음'} ~ {q.max_tier || '없음'}
                        </p>
                        <p className="text-gray-300">
                          시간: {q.play_time_start}시 ~ {q.play_time_end}시
                        </p>
                        <p className="text-gray-400 text-xs">
                          생성: {new Date(q.created_at).toLocaleString('ko-KR')}
                        </p>
                        <p className={`text-xs ${isExpired ? 'text-red-300 font-bold' : 'text-gray-400'}`}>
                          만료: {new Date(q.expires_at).toLocaleString('ko-KR')}
                          {isExpired && ' (만료됨!)'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 매칭 */}
        <div className="bg-gray-700 p-4 rounded">
          <h2 className="text-xl font-bold text-white mb-3">
            🤝 매칭 결과 ({matches.length})
          </h2>
          {matches.length === 0 ? (
            <p className="text-gray-400">매칭 결과가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {matches.map((match) => (
                <div key={match.id} className="bg-gray-600 p-3 rounded text-sm">
                  <p className="text-white">
                    User1: {match.user1_id.substring(0, 8)}... ↔️ User2:{' '}
                    {match.user2_id.substring(0, 8)}...
                  </p>
                  <p className="text-gray-300">점수: {match.match_score}</p>
                  <p className="text-gray-300">
                    상태: {match.user1_status} / {match.user2_status}
                  </p>
                  <p className="text-gray-400 text-xs">
                    생성: {new Date(match.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 알림 */}
        <div className="bg-gray-700 p-4 rounded">
          <h2 className="text-xl font-bold text-white mb-3">
            🔔 알림 ({notifications.length})
          </h2>
          {notifications.length === 0 ? (
            <p className="text-gray-400">알림이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-gray-600 p-3 rounded text-sm">
                  <p className="text-white font-semibold">{notif.title}</p>
                  <p className="text-gray-300">{notif.message}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(notif.created_at).toLocaleString()} |{' '}
                    {notif.is_read ? '읽음' : '안 읽음'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
