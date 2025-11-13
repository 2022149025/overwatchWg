import { supabase } from '../lib/supabase';
import { UserProfile, MatchmakingPreferences } from '../types';
import { isValidUUID, isValidDiscordId, sanitizeString } from '../lib/validation';
import { matchingRateLimiter, notificationRateLimiter, checkRateLimit } from '../lib/rateLimit';
import { logger } from '../lib/logger';

// 매칭 설정 상수
const MIN_MATCH_SCORE = 0.6; // 최소 매칭 점수 (60%)

// 사용자 프로필 생성/업데이트
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }) {
  // UUID 검증
  if (!isValidUUID(profile.id)) {
    throw new Error('Invalid user ID format');
  }
  
  // 디스코드 ID 검증 (있는 경우에만)
  if (profile.discordId && !isValidDiscordId(profile.discordId)) {
    throw new Error('Invalid Discord ID format');
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: profile.id,
      email: profile.id, // 임시로 id를 email로 사용
      nickname: sanitizeString(profile.nickname || 'User'),
      bio: sanitizeString(profile.bio || ''),
      profile_picture: profile.profilePicture || '',
      mbti: profile.mbti,
      hero: profile.hero,
      main_role: profile.mainRole,
      preferred_tanks: profile.preferredTanks || [],
      preferred_damage: profile.preferredDamage || [],
      preferred_supports: profile.preferredSupports || [],
      max_tiers: profile.maxTiers || {},
      preferred_teammate_communication: profile.preferredTeammateCommunication,
      self_communication_style: profile.selfCommunicationStyle,
      teammate_preference: profile.teammatePreference,
      discord_id: profile.discordId || '',
    })
    .select()
    .single();

  if (error) {
    logger.error('Error upserting user profile:', error);
    throw error;
  }

  return data;
}

// 사용자 프로필 조회
export async function getUserProfile(userId: string) {
  // UUID 검증
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    logger.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
}

// 매칭 대기열에 추가
export async function addToMatchingQueue(
  userId: string,
  preferences: MatchmakingPreferences,
  analyzedKeywords: string[],
  analyzedSentiment: string
) {
  // Rate limiting 체크
  checkRateLimit(
    matchingRateLimiter,
    userId,
    '매칭 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
  );
  
  // UUID 검증
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  // 기존 대기열 취소
  await cancelMatchingQueue(userId);

  const { data, error } = await supabase
    .from('matching_queue')
    .insert({
      user_id: userId,
      min_tier: preferences.preferredTiers?.min || null,
      max_tier: preferences.preferredTiers?.max || null,
      game_modes: preferences.gameModes || [],
      play_days: preferences.playDays || [],
      play_time_start: preferences.playTimeStart,
      play_time_end: preferences.playTimeEnd,
      priority_requirements: preferences.priorityRequirements || '',
      preferred_role: preferences.preferredRole || null,
      analyzed_keywords: analyzedKeywords,
      analyzed_sentiment: analyzedSentiment,
      status: 'waiting',
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding to matching queue:', error);
    throw error;
  }

  return data;
}

// 매칭 대기열 취소 (삭제)
export async function cancelMatchingQueue(userId: string) {
  const { error } = await supabase
    .from('matching_queue')
    .delete()
    .eq('user_id', userId)
    .eq('status', 'waiting');

  if (error) {
    console.error('Error cancelling matching queue:', error);
    throw error;
  }
}

// 만료된 대기열 정리
export async function cleanupExpiredQueue() {
  const { error } = await supabase
    .from('matching_queue')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Error cleaning up expired queue:', error);
    throw error;
  }
}

// 매칭 점수 계산
function calculateMatchScore(
  user1: any,
  user2: any,
  queue1: any,
  queue2: any
): number {
  let score = 0;

  // 1. 플레이 시간 일치도 (25%)
  const timeScore = calculateTimeOverlap(
    queue1.play_days,
    queue1.play_time_start,
    queue1.play_time_end,
    queue2.play_days,
    queue2.play_time_start,
    queue2.play_time_end
  );
  score += timeScore * 0.25;

  // 2. 티어 범위 일치도 (20%)
  const tierScore = calculateTierMatch(
    queue1.min_tier,
    queue1.max_tier,
    queue2.min_tier,
    queue2.max_tier
  );
  score += tierScore * 0.2;

  // 3. 포지션 일치도 (20%)
  const roleScore = calculateRoleMatch(
    queue1.preferred_role,
    user2.main_role,
    queue2.preferred_role,
    user1.main_role
  );
  score += roleScore * 0.2;

  // 4. 게임 모드 일치도 (15%)
  const gameModeScore = calculateArrayOverlap(queue1.game_modes, queue2.game_modes);
  score += gameModeScore * 0.15;

  // 5. 커뮤니케이션 스타일 일치도 (12%)
  const commScore = calculateCommunicationMatch(
    user1.preferred_teammate_communication,
    user2.self_communication_style
  );
  score += commScore * 0.12;

  // 6. MBTI 궁합 (8%)
  const mbtiScore = calculateMBTICompatibility(user1.mbti, user2.mbti);
  score += mbtiScore * 0.08;

  return Math.round(score * 100) / 100; // 소수점 2자리
}

// 플레이 시간 겹침 계산
function calculateTimeOverlap(
  days1: string[],
  start1: number,
  end1: number,
  days2: string[],
  start2: number,
  end2: number
): number {
  if (!days1?.length || !days2?.length) return 0;
  
  // 요일 겹침 개수 계산
  const set1 = new Set(days1);
  const set2 = new Set(days2);
  const commonDays = [...set1].filter(x => set2.has(x));
  const commonDaysCount = commonDays.length;
  
  // 요일이 하나도 안 겹치면 0점
  if (commonDaysCount === 0) return 0;
  
  // 시간 겹침 계산
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  const overlapHours = Math.max(0, overlapEnd - overlapStart);
  
  // 요일 점수: 2일 이상 겹치면 만점(1.0), 1일이면 0.5
  const dayScore = commonDaysCount >= 2 ? 1.0 : 0.5;
  
  // 시간 점수: 3시간 이상 겹치면 만점(1.0), 그 이하는 비례
  const timeScore = overlapHours >= 3 ? 1.0 : overlapHours / 3;
  
  // 요일과 시간 점수의 평균
  return (dayScore + timeScore) / 2;
}

// 배열 겹침 비율 계산
function calculateArrayOverlap(arr1: string[], arr2: string[]): number {
  if (!arr1?.length || !arr2?.length) return 0;
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

// 티어 매칭 계산
function calculateTierMatch(
  min1: string | null,
  max1: string | null,
  min2: string | null,
  max2: string | null
): number {
  if (!min1 || !max1 || !min2 || !max2) return 0.5; // 티어 미설정 시 중립

  // 티어를 세부 단계로 변환 (브론즈5=1, 브론즈4=2, ..., 챌린저1=40)
  const tierToDetailedNum = (tier: string): number => {
    const tierMap: { [key: string]: number } = {
      '브론즈': 0, '실버': 5, '골드': 10, '플래티넘': 15,
      '다이아몬드': 20, '마스터': 25, '그랜드마스터': 30, '챌린저': 35
    };
    
    // 티어명과 숫자 분리
    const match = tier.match(/^(.+?)(\d+)$/);
    if (!match) {
      // 숫자가 없으면 해당 티어의 중간값 (3단계)
      const tierName = tier.replace(/[0-9]/g, '');
      return (tierMap[tierName] || 0) + 3;
    }
    
    const tierName = match[1];
    const tierNum = parseInt(match[2]);
    const baseValue = tierMap[tierName] || 0;
    
    // 5단계 시스템: 5가 가장 낮고, 1이 가장 높음
    // 역순으로 계산: 5단계 = +1, 4단계 = +2, ..., 1단계 = +5
    return baseValue + (6 - tierNum);
  };

  const min1Num = tierToDetailedNum(min1);
  const max1Num = tierToDetailedNum(max1);
  const min2Num = tierToDetailedNum(min2);
  const max2Num = tierToDetailedNum(max2);

  // 겹치는 구간 계산
  const overlapStart = Math.max(min1Num, min2Num);
  const overlapEnd = Math.min(max1Num, max2Num);
  const overlapSteps = Math.max(0, overlapEnd - overlapStart + 1);

  // 겹치는 단계에 따른 점수
  // 5단계 이상: 1.0 (만점)
  // 4단계: 0.8
  // 3단계: 0.6
  // 2단계: 0.4
  // 1단계: 0.2
  // 0단계: 0.0
  if (overlapSteps >= 5) return 1.0;
  if (overlapSteps === 4) return 0.8;
  if (overlapSteps === 3) return 0.6;
  if (overlapSteps === 2) return 0.4;
  if (overlapSteps === 1) return 0.2;
  return 0.0;
}

// 포지션 일치도 계산
function calculateRoleMatch(
  user1PreferredRole: string | null,
  user2ActualRole: string,
  user2PreferredRole: string | null,
  user1ActualRole: string
): number {
  // 올라운더는 무조건 일치
  const ALLROUNDER = '올라운더';
  
  // User1이 선호하는 포지션과 User2의 실제 포지션 비교
  let score1 = 0;
  if (!user1PreferredRole || user1PreferredRole === ALLROUNDER || user2ActualRole === ALLROUNDER) {
    score1 = 1; // 올라운더이거나 선호 없음 = 일치
  } else if (user1PreferredRole === user2ActualRole) {
    score1 = 1; // 일치
  } else {
    score1 = 0; // 불일치
  }
  
  // User2가 선호하는 포지션과 User1의 실제 포지션 비교
  let score2 = 0;
  if (!user2PreferredRole || user2PreferredRole === ALLROUNDER || user1ActualRole === ALLROUNDER) {
    score2 = 1; // 올라운더이거나 선호 없음 = 일치
  } else if (user2PreferredRole === user1ActualRole) {
    score2 = 1; // 일치
  } else {
    score2 = 0; // 불일치
  }
  
  // 양쪽 점수의 평균
  return (score1 + score2) / 2;
}

// 커뮤니케이션 스타일 매칭
function calculateCommunicationMatch(preferred: string, actual: string): number {
  if (!preferred || !actual) return 0.5;
  
  // 완전 일치
  if (preferred === actual) return 1;
  
  // 부분 일치 (예: TALKATIVE와 MIC_ONLY는 어느 정도 호환)
  const compatibilityMap: { [key: string]: { [key: string]: number } } = {
    'TALKATIVE': { 'MIC_ONLY': 0.8, 'CHAT_ONLY': 0.3, 'QUIET': 0.1 },
    'MIC_ONLY': { 'TALKATIVE': 0.8, 'CHAT_ONLY': 0.5, 'QUIET': 0.3 },
    'CHAT_ONLY': { 'TALKATIVE': 0.3, 'MIC_ONLY': 0.5, 'QUIET': 0.7 },
    'QUIET': { 'TALKATIVE': 0.1, 'MIC_ONLY': 0.3, 'CHAT_ONLY': 0.7 },
  };

  return compatibilityMap[preferred]?.[actual] || 0.5;
}

// MBTI 궁합 계산
function calculateMBTICompatibility(mbti1: string, mbti2: string): number {
  if (!mbti1 || !mbti2) return 0.5;
  
  // 같은 MBTI
  if (mbti1 === mbti2) return 0.8;
  
  // 보완적인 MBTI (예: E와 I, T와 F)
  let compatibility = 0;
  for (let i = 0; i < 4; i++) {
    if (mbti1[i] === mbti2[i]) {
      compatibility += 0.25; // 같은 특성
    } else {
      compatibility += 0.15; // 다른 특성 (보완적)
    }
  }
  
  return compatibility;
}

// 매칭 찾기 (대기열에서)
export async function findMatch(userId: string) {
  // 현재 사용자 정보 가져오기
  const { data: currentUser, error: userError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) throw userError;

  // 현재 사용자의 대기열 정보
  const { data: currentQueue, error: queueError } = await supabase
    .from('matching_queue')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'waiting')
    .single();

  if (queueError) throw queueError;

  // 다른 대기 중인 사용자들 찾기
  const { data: otherQueues, error: othersError } = await supabase
    .from('matching_queue')
    .select('*, user_profiles(*)')
    .eq('status', 'waiting')
    .neq('user_id', userId);

  if (othersError) throw othersError;

  if (!otherQueues || otherQueues.length === 0) {
    return null; // 매칭 가능한 사용자 없음
  }

  // 각 사용자와의 매칭 점수 계산
  const matches = otherQueues.map((otherQueue: any) => {
    const score = calculateMatchScore(
      currentUser,
      otherQueue.user_profiles,
      currentQueue,
      otherQueue
    );
    return {
      user: otherQueue.user_profiles,
      queue: otherQueue,
      score,
    };
  });

  // 최소 매칭 점수 필터링
  const qualifiedMatches = matches.filter(match => match.score >= MIN_MATCH_SCORE);

  if (qualifiedMatches.length === 0) {
    logger.info(`No qualified matches found (minimum score: ${MIN_MATCH_SCORE * 100}%)`);
    return null; // 60점 이상인 매칭이 없음
  }

  // 점수순 정렬
  qualifiedMatches.sort((a, b) => b.score - a.score);

  // 가장 높은 점수의 사용자 반환
  logger.info(`Best match found with score: ${Math.round(qualifiedMatches[0].score * 100)}%`);
  return qualifiedMatches[0];
}

// 매칭 생성
export async function createMatch(
  user1Id: string,
  user2Id: string,
  matchScore: number,
  explanation: string
) {
  const { data, error } = await supabase
    .from('matches')
    .insert({
      user1_id: user1Id,
      user2_id: user2Id,
      match_score: matchScore,
      match_explanation: explanation,
      user1_status: 'pending',
      user2_status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating match:', error);
    throw error;
  }

  // 두 사용자의 대기열에서 삭제 (매칭 완료)
  const { error: deleteError } = await supabase
    .from('matching_queue')
    .delete()
    .in('user_id', [user1Id, user2Id])
    .eq('status', 'waiting');

  if (deleteError) {
    console.error('Error deleting from queue:', deleteError);
    // 에러가 나도 매칭은 생성되었으므로 계속 진행
  }

  return data;
}

// 알림 생성
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  matchId?: string
) {
  // Rate limiting 체크
  checkRateLimit(
    notificationRateLimiter,
    userId,
    '알림 생성 요청이 너무 많습니다.'
  );
  
  // UUID 검증
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  const { data, error} = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      match_id: matchId || null,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data;
}

// 매칭 상태 업데이트 (수락/거절)
export async function updateMatchStatus(
  matchId: string,
  userId: string,
  status: 'accepted' | 'rejected'
) {
  // 매칭 정보 가져오기
  const { data: match, error: fetchError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (fetchError) throw fetchError;

  // 어느 사용자인지 확인
  const isUser1 = match.user1_id === userId;
  const statusField = isUser1 ? 'user1_status' : 'user2_status';

  // 상태 업데이트
  const { data, error } = await supabase
    .from('matches')
    .update({ [statusField]: status })
    .eq('id', matchId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// 사용자의 알림 목록 가져오기
export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }

  return data;
}

// 알림 읽음 처리
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// 사용자의 매칭 히스토리 가져오기
export async function getUserMatches(userId: string) {
  // UUID 검증 - SQL Injection 방어
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:user_profiles!matches_user1_id_fkey(*),
      user2:user_profiles!matches_user2_id_fkey(*)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user matches:', error);
    throw error;
  }

  return data;
}
