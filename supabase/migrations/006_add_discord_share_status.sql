-- matches 테이블에 디스코드 ID 공유 상태 필드 추가
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS user1_discord_shared BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS user2_discord_shared BOOLEAN DEFAULT FALSE;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_matches_discord_shared 
ON public.matches(user1_discord_shared, user2_discord_shared);
