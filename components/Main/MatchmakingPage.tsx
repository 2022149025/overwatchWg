import React, { useState, useEffect, useCallback } from 'react';
import {
  FullTier,
  GameMode,
  DayOfWeek,
  MatchmakingPreferences,
  MatchedUser,
  UserProfile,
  OverwatchRole, // Ensure OverwatchRole is imported
} from '../../types';
import {
  TIER_OPTIONS,
  GAME_MODE_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
  DUMMY_MATCHED_USER,
} from '../../constants';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Input from '../Input';
import TierSelector from '../TierSelector';
import { analyzeMatchingPreferences, generateMatchExplanation } from '../../services/geminiService';
import { 
  addToMatchingQueue, 
  findMatch, 
  createMatch, 
  createNotification,
  getUserProfile 
} from '../../services/matchingService';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DOMPurify from 'dompurify';

interface MatchmakingPageProps {
  userProfile: UserProfile | null;
  onNewMatchFound: (user: MatchedUser) => void;
  currentMatchedUser: MatchedUser | null;
  onClearMatch: () => void;
}

const MatchmakingPage: React.FC<MatchmakingPageProps> = ({
  userProfile,
  onNewMatchFound,
  currentMatchedUser,
  onClearMatch,
}) => {
  const { user } = useAuth();
  const [minTier, setMinTier] = useState<FullTier | ''>('');
  const [maxTier, setMaxTier] = useState<FullTier | ''>('');
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [playDays, setPlayDays] = useState<DayOfWeek[]>([]);
  const [playTimeStart, setPlayTimeStart] = useState<number>(0);
  const [playTimeEnd, setPlayTimeEnd] = useState<number>(24);
  const [priorityRequirements, setPriorityRequirements] = useState<string>('');
  const [preferredRole, setPreferredRole] = useState<OverwatchRole | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingInQueue, setIsWaitingInQueue] = useState(false);
  const [parsedRequirements, setParsedRequirements] = useState<{ keywords: string[]; sentiment: string } | null>(null);
  const [matchExplanation, setMatchExplanation] = useState<string>('');
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [myDiscordShared, setMyDiscordShared] = useState(false);
  const [otherDiscordShared, setOtherDiscordShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // Reset state when currentMatchedUser is cleared
    if (!currentMatchedUser) {
      setParsedRequirements(null);
      setCurrentMatch(null);
      setMyDiscordShared(false);
      setOtherDiscordShared(false);
    }
  }, [currentMatchedUser]);

  // 실시간 디스코드 공유 상태 감지
  useEffect(() => {
    if (!currentMatch || !user) return;

    const channel = supabase
      .channel(`match_discord_share:${currentMatch.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${currentMatch.id}`,
        },
        (payload) => {
          console.log('Match updated:', payload);
          const updated = payload.new;
          const isUser1 = updated.user1_id === user.id;
          setMyDiscordShared(isUser1 ? updated.user1_discord_shared : updated.user2_discord_shared);
          setOtherDiscordShared(isUser1 ? updated.user2_discord_shared : updated.user1_discord_shared);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentMatch, user]);

  // 대기열 상태 확인 및 실시간 매칭 감지
  useEffect(() => {
    if (!user) return;
    
    // 이미 매칭된 상태면 대기열 확인 안함
    if (currentMatchedUser) return;

    const checkQueueStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('matching_queue')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'waiting')
          .maybeSingle(); // single() 대신 maybeSingle() - 결과 없어도 에러 안남

        if (data && !error) {
          setIsWaitingInQueue(true);
        } else {
          setIsWaitingInQueue(false);
        }
      } catch (err) {
        console.error('Error checking queue status:', err);
        setIsWaitingInQueue(false);
      }
    };

    checkQueueStatus();

    // 실시간 매칭 감지 - matches 테이블 구독 (필터 없이 모든 매칭 감지)
    const matchChannel = supabase
      .channel(`matches:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
        },
        async (payload) => {
          console.log('New match detected:', payload);
          const match = payload.new;
          
          // 내가 포함된 매칭인지 확인
          if (match.user1_id === user.id || match.user2_id === user.id) {
            console.log('This match is for me!');
            await handleMatchDetected(match);
          }
        }
      )
      .subscribe((status) => {
        console.log('Match channel subscription status:', status);
      });

    return () => {
      supabase.removeChannel(matchChannel);
    };
  }, [user, currentMatchedUser]);

  // 매칭 감지 시 처리
  const handleMatchDetected = async (match: any) => {
    try {
      setIsWaitingInQueue(false);
      
      // 상대방 정보 가져오기
      const otherUserId = match.user1_id === user?.id ? match.user2_id : match.user1_id;
      const otherUserProfile = await getUserProfile(otherUserId);
      
      if (!otherUserProfile) {
        console.error('Failed to fetch other user profile');
        return;
      }

      // 매칭 설명 설정
      setMatchExplanation(match.match_explanation || `매칭 점수 ${Math.round(match.match_score * 100)}%로 좋은 궁합입니다!`);
      
      // 매칭된 사용자 정보 표시
      const matchedUser: MatchedUser = {
        id: otherUserProfile.id,
        nickname: otherUserProfile.nickname,
        profilePicture: otherUserProfile.profile_picture || 'https://picsum.photos/200/200',
        bio: otherUserProfile.bio || '',
        mbti: otherUserProfile.mbti,
        hero: otherUserProfile.hero,
        mainRole: otherUserProfile.main_role,
        maxTiers: otherUserProfile.max_tiers || {},
        discordId: otherUserProfile.discord_id || '',
      };
      
      setCurrentMatch(match);
      onNewMatchFound(matchedUser);
      
      // 디스코드 공유 상태 설정
      const isUser1 = match.user1_id === user?.id;
      setMyDiscordShared(isUser1 ? match.user1_discord_shared : match.user2_discord_shared);
      setOtherDiscordShared(isUser1 ? match.user2_discord_shared : match.user1_discord_shared);
      
      // 브라우저 알림
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('매칭 성공!', {
          body: `${otherUserProfile.nickname}님과 매칭되었습니다!`,
          icon: '/overwatch-icon.png',
        });
      }
    } catch (error) {
      console.error('Error handling match detection:', error);
    }
  };

  const handleGameModeToggle = (mode: GameMode) => {
    setGameModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setPlayDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleMatchmakingStart = useCallback(async () => {
    if (!user || !userProfile) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    onClearMatch();

    const preferences: MatchmakingPreferences = {
      preferredTiers: { min: minTier || undefined, max: maxTier || undefined },
      gameModes,
      playDays,
      playTimeStart,
      playTimeEnd,
      priorityRequirements,
      preferredRole: preferredRole || undefined,
    };

    try {
      // 만료된 대기열 정리
      try {
        const { cleanupExpiredQueue } = await import('../../services/matchingService');
        await cleanupExpiredQueue();
        console.log('만료된 대기열 정리 완료');
      } catch (err) {
        console.warn('만료된 대기열 정리 실패:', err);
      }

      // Gemini로 우선순위 요구사항 분석
      let analyzedKeywords: string[] = [];
      let analyzedSentiment = 'neutral';
      
      if (priorityRequirements.trim()) {
        const analysis = await analyzeMatchingPreferences(priorityRequirements);
        setParsedRequirements(analysis);
        analyzedKeywords = analysis.keywords;
        analyzedSentiment = analysis.sentiment;
        console.log('Gemini 분석 결과:', analysis);
      }

      // 대기열에 추가
      await addToMatchingQueue(user.id, preferences, analyzedKeywords, analyzedSentiment);
      console.log('대기열에 추가되었습니다.');
      
      setIsWaitingInQueue(true);
      
      // 즉시 매칭 시도
      const match = await findMatch(user.id);
      
      if (match) {
        console.log('매칭 찾음:', match);
        
        // Gemini로 매칭 설명 생성 (실패해도 계속 진행)
        let explanation = `매칭 점수 ${Math.round(match.score * 100)}%로 좋은 궁합입니다!`;
        try {
          const currentUserProfile = await getUserProfile(user.id);
          explanation = await generateMatchExplanation(
            currentUserProfile,
            match.user,
            match.score
          );
        } catch (err) {
          console.warn('Gemini 설명 생성 실패, 기본 메시지 사용:', err);
        }
        setMatchExplanation(explanation);
        
        // 매칭 생성
        const createdMatch = await createMatch(
          user.id,
          match.user.id,
          match.score,
          explanation
        );
        
        // 양쪽 사용자에게 알림 생성 (실패해도 계속 진행)
        try {
          await createNotification(
            user.id,
            'match_found',
            '매칭 성공!',
            `${match.user.nickname}님과 매칭되었습니다!`,
            createdMatch.id
          );
        } catch (err) {
          console.warn('알림 생성 실패 (user1):', err);
        }
        
        try {
          await createNotification(
            match.user.id,
            'match_found',
            '매칭 성공!',
            `${userProfile.nickname}님과 매칭되었습니다!`,
            createdMatch.id
          );
        } catch (err) {
          console.warn('알림 생성 실패 (user2):', err);
        }
        
        // 매칭된 사용자 정보 표시
        const matchedUser: MatchedUser = {
          id: match.user.id,
          nickname: match.user.nickname,
          profilePicture: match.user.profile_picture || 'https://picsum.photos/200/200',
          bio: match.user.bio || '',
          mbti: match.user.mbti,
          hero: match.user.hero,
          mainRole: match.user.main_role,
          maxTiers: match.user.max_tiers || {},
          discordId: match.user.discord_id || '',
        };
        
        setCurrentMatch(createdMatch);
        onNewMatchFound(matchedUser);
        setIsWaitingInQueue(false);
      } else {
        // 매칭 가능한 사용자 없음 - 대기열에서 대기
        alert('현재 매칭 점수 60점 이상인 사용자가 없습니다.\n대기열에 등록되었습니다. 적합한 사용자가 나타나면 자동으로 매칭됩니다.');
        setIsWaitingInQueue(true);
      }
      
    } catch (error) {
      console.error('매칭 오류:', error);
      alert('매칭 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsWaitingInQueue(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    user,
    userProfile,
    minTier,
    maxTier,
    gameModes,
    playDays,
    playTimeStart,
    playTimeEnd,
    priorityRequirements,
    onNewMatchFound,
    onClearMatch,
  ]);



  const handleShareDiscord = async () => {
    if (!user || !currentMatch) return;
    
    setIsSharing(true);
    try {
      const isUser1 = currentMatch.user1_id === user.id;
      const updateField = isUser1 ? 'user1_discord_shared' : 'user2_discord_shared';
      
      const { error } = await supabase
        .from('matches')
        .update({ [updateField]: true })
        .eq('id', currentMatch.id);
      
      if (error) throw error;
      
      setMyDiscordShared(true);
      alert('디스코드 ID 공유를 활성화했습니다!');
    } catch (error) {
      console.error('Error sharing discord:', error);
      alert('디스코드 ID 공유 중 오류가 발생했습니다.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleFindAgain = () => {
    onClearMatch();
    setMatchExplanation('');
    setMyDiscordShared(false);
    setOtherDiscordShared(false);
    handleMatchmakingStart();
  };

  const handleCancelQueue = async () => {
    if (!user) return;
    
    try {
      const { cancelMatchingQueue } = await import('../../services/matchingService');
      await cancelMatchingQueue(user.id);
      setIsWaitingInQueue(false);
      alert('대기열에서 취소되었습니다.');
    } catch (error) {
      console.error('대기열 취소 오류:', error);
    }
  };

  if (!userProfile) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">로그인이 필요합니다</h2>
        <p className="text-gray-300">매칭 기능을 사용하려면 로그인 해주세요.</p>
        <Button onClick={() => window.location.hash = '/auth'} className="mt-6">로그인 페이지로 이동</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">매칭 진행</h2>

      {isWaitingInQueue && !currentMatchedUser ? (
        <div className="text-center py-12">
          <div className="mb-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
          <h3 className="text-2xl font-bold text-blue-300 mb-4">매칭 진행 중...</h3>
          <p className="text-gray-300 mb-2">적합한 게임 친구를 찾고 있습니다</p>
          <p className="text-gray-400 text-sm mb-8">매칭이 완료되면 알려드릴게요!</p>
          
          <div className="bg-blue-900 border border-blue-500 rounded-lg p-4 max-w-md mx-auto mb-6">
            <p className="text-blue-200 text-sm">
              💡 다른 사용자가 매칭을 시작하면 자동으로 매칭됩니다
            </p>
          </div>

          <Button
            onClick={handleCancelQueue}
            variant="secondary"
            size="lg"
          >
            매칭 취소
          </Button>
        </div>
      ) : !currentMatchedUser ? (
        <div className="space-y-6">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <TierSelector
                label="선호 최소 티어"
                value={minTier}
                onChange={(value) => setMinTier(value)}
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <TierSelector
                label="선호 최대 티어"
                value={maxTier}
                onChange={(value) => setMaxTier(value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">선호 게임 모드 (다중 선택)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GAME_MODE_OPTIONS.map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  variant={gameModes.includes(mode) ? 'primary' : 'secondary'}
                  onClick={() => handleGameModeToggle(mode)}
                  size="sm"
                  className="flex-grow justify-center"
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">선호 플레이 시간대</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
              {DAY_OF_WEEK_OPTIONS.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={playDays.includes(day) ? 'primary' : 'secondary'}
                  onClick={() => handleDayToggle(day)}
                  size="sm"
                  className="!text-sm !py-2 !px-2 !min-w-0 !h-auto"
                >
                  {day}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="playTimeStart" className="block text-gray-300 text-sm font-bold mb-2">
                  시작 시간 (시)
                </label>
                <input
                  id="playTimeStart"
                  type="number"
                  min="0"
                  max="23"
                  value={playTimeStart}
                  onChange={(e) => setPlayTimeStart(Number(e.target.value))}
                  className="w-full px-4 py-3 text-2xl font-bold text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="playTimeEnd" className="block text-gray-300 text-sm font-bold mb-2">
                  종료 시간 (시)
                </label>
                <input
                  id="playTimeEnd"
                  type="number"
                  min="0"
                  max="24"
                  value={playTimeEnd}
                  onChange={(e) => setPlayTimeEnd(Number(e.target.value))}
                  className="w-full px-4 py-3 text-2xl font-bold text-center border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-lg font-bold mb-3">선호하는 상대 포지션</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[OverwatchRole.TANK, OverwatchRole.DAMAGE, OverwatchRole.SUPPORT, OverwatchRole.ALLROUNDER].map((role) => (
                <Button
                  key={role}
                  type="button"
                  variant={preferredRole === role ? 'primary' : 'secondary'}
                  onClick={() => setPreferredRole(role)}
                  size="sm"
                  className="!text-lg !py-3 !px-3 !min-w-0 !w-full !h-auto"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="priorityRequirements" className="block text-gray-300 text-sm font-bold mb-2">
              매칭 우선순위 요구사항 (자유 텍스트)
            </label>
            <textarea
              id="priorityRequirements"
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 min-h-[100px]"
              value={priorityRequirements}
              onChange={(e) => setPriorityRequirements(e.target.value)}
              placeholder="예: 메르시 주챔은 매칭시켜주지 마세요, 최대한 화 안내는 사람으로 등등"
            ></textarea>
            {parsedRequirements && (
              <div className="mt-4 p-3 bg-gray-700 rounded-md text-sm">
                <p className="font-semibold text-blue-200">Gemini 분석 결과:</p>
                <p><strong>키워드:</strong> {parsedRequirements.keywords.join(', ')}</p>
                <p><strong>감성:</strong> {parsedRequirements.sentiment}</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleMatchmakingStart}
            disabled={isLoading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {isLoading ? '매칭 찾는 중...' : '매칭 시작!'}
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-4">매칭 성공!</h3>
          <p className="text-xl text-gray-200 mb-4">
            <span className="font-semibold text-blue-300">{currentMatchedUser.nickname}</span> 님과 매칭되었습니다!
          </p>
          
          {matchExplanation && (
            <div className="bg-blue-900 border border-blue-500 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-200 font-semibold mb-2">🤖 AI 매칭 분석</p>
              <p 
                className="text-blue-100 text-sm"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(matchExplanation) 
                }}
              />
            </div>
          )}
          <div className="bg-gray-700 p-6 rounded-lg max-w-sm mx-auto shadow-md">
            <img
              src={currentMatchedUser.profilePicture}
              alt={currentMatchedUser.nickname}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-blue-500"
            />
            <p className="text-lg font-semibold text-white">{currentMatchedUser.nickname}</p>
            <p className="text-gray-400 text-sm italic mb-2">{currentMatchedUser.bio}</p>
            <p className="text-gray-300">MBTI: {currentMatchedUser.mbti} | 영웅 유형: {currentMatchedUser.hero}</p>
            {/* FIX: Removed redundant type assertion `as OverwatchRole.TANK | OverwatchRole.DAMAGE | OverwatchRole.SUPPORT`
                because `currentMatchedUser.mainRole` is already of type `OverwatchRole`,
                which correctly provides the string literal keys for `maxTiers`. */}
            {currentMatchedUser.maxTiers[currentMatchedUser.mainRole] && (
                <p className="text-gray-300">최대 티어 ({currentMatchedUser.mainRole}): {currentMatchedUser.maxTiers[currentMatchedUser.mainRole]}</p>
            )}
          </div>

          <div className="mt-8 space-y-4">
            {/* 디스코드 ID 공유 상태 */}
            <div className="bg-blue-900 border border-blue-500 rounded-lg p-4">
              <p className="text-blue-200 font-semibold mb-3 text-center">💬 디스코드 ID 공유</p>
              
              <div className="space-y-3">
                {/* 내 공유 상태 */}
                <div className="flex items-center justify-between bg-gray-800 rounded p-3">
                  <div>
                    <p className="text-white font-semibold">내 공유 상태</p>
                    <p className="text-gray-400 text-sm">
                      {myDiscordShared ? '✅ 공유 완료' : '⏳ 공유 대기 중'}
                    </p>
                  </div>
                  {!myDiscordShared && (
                    <Button
                      onClick={handleShareDiscord}
                      disabled={isSharing || !userProfile?.discordId}
                      variant="primary"
                      className="!text-sm !py-2 !px-4"
                    >
                      {isSharing ? '처리 중...' : '공유하기'}
                    </Button>
                  )}
                </div>

                {/* 상대방 공유 상태 */}
                <div className="flex items-center justify-between bg-gray-800 rounded p-3">
                  <div>
                    <p className="text-white font-semibold">{currentMatchedUser.nickname}님</p>
                    <p className="text-gray-400 text-sm">
                      {otherDiscordShared ? '✅ 공유 완료' : '⏳ 공유 대기 중'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 양쪽 모두 공유했을 때만 디스코드 ID 표시 */}
              {myDiscordShared && otherDiscordShared ? (
                <div className="mt-4 space-y-2 border-t border-blue-700 pt-4">
                  <p className="text-green-300 font-semibold text-center mb-3">
                    🎉 양쪽 모두 공유 완료! 디스코드로 연락하세요!
                  </p>
                  {userProfile?.discordId && (
                    <div className="bg-gray-800 rounded p-3">
                      <p className="text-gray-400 text-sm mb-1">내 디스코드 ID</p>
                      <p className="text-white font-mono text-lg">{userProfile.discordId}</p>
                    </div>
                  )}
                  {currentMatchedUser.discordId && (
                    <div className="bg-gray-800 rounded p-3">
                      <p className="text-gray-400 text-sm mb-1">{currentMatchedUser.nickname}님의 디스코드 ID</p>
                      <p className="text-white font-mono text-lg">{currentMatchedUser.discordId}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 bg-yellow-900 border border-yellow-600 rounded p-3">
                  <p className="text-yellow-200 text-sm text-center">
                    ℹ️ 양쪽 모두 "공유하기" 버튼을 눌러야 디스코드 ID를 확인할 수 있습니다
                  </p>
                </div>
              )}

              {!userProfile?.discordId && (
                <div className="mt-4 bg-red-900 border border-red-600 rounded p-3">
                  <p className="text-red-200 text-sm text-center">
                    ⚠️ 디스코드 ID가 설정되지 않았습니다. 프로필에서 설정해주세요.
                  </p>
                </div>
              )}
            </div>

            <Button onClick={handleFindAgain} variant="secondary" className="w-full">
              다시 찾기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchmakingPage;