-- 사용자 프로필 테이블
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  bio TEXT,
  profile_picture TEXT,
  
  -- 페르소나 정보
  mbti TEXT NOT NULL,
  hero TEXT NOT NULL,
  main_role TEXT NOT NULL,
  
  -- 선호 영웅
  preferred_tanks TEXT[],
  preferred_damage TEXT[],
  preferred_supports TEXT[],
  
  -- 최대 티어
  max_tiers JSONB DEFAULT '{}',
  
  -- 커뮤니케이션 스타일
  preferred_teammate_communication TEXT,
  self_communication_style TEXT,
  teammate_preference TEXT,
  
  -- 디스코드
  discord_id TEXT,
  
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 매칭 대기열 테이블
CREATE TABLE IF NOT EXISTS public.matching_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- 매칭 조건
  min_tier TEXT,
  max_tier TEXT,
  game_modes TEXT[],
  play_days TEXT[],
  play_time_start INTEGER,
  play_time_end INTEGER,
  priority_requirements TEXT,
  
  -- Gemini 분석 결과
  analyzed_keywords TEXT[],
  analyzed_sentiment TEXT,
  
  -- 상태
  status TEXT DEFAULT 'waiting', -- waiting, matched, cancelled
  
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

-- 매칭 결과 테이블
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 매칭된 사용자들
  user1_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- 매칭 점수
  match_score DECIMAL(5,2),
  match_explanation TEXT, -- Gemini가 생성한 설명
  
  -- 상태
  user1_status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  user2_status TEXT DEFAULT 'pending',
  
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 알림 테이블
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- 알림 내용
  type TEXT NOT NULL, -- match_found, match_accepted, match_rejected
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- 관련 데이터
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  
  -- 상태
  is_read BOOLEAN DEFAULT FALSE,
  
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_matching_queue_user_id ON public.matching_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_matching_queue_status ON public.matching_queue(status);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matching_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 데이터만 볼 수 있음
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 매칭 대기열: 자신의 대기열만 관리
CREATE POLICY "Users can view own queue" ON public.matching_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queue" ON public.matching_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own queue" ON public.matching_queue
  FOR UPDATE USING (auth.uid() = user_id);

-- 매칭 결과: 자신이 포함된 매칭만 볼 수 있음
CREATE POLICY "Users can view own matches" ON public.matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update own match status" ON public.matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 알림: 자신의 알림만 볼 수 있음
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거: updated_at 자동 업데이트
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
