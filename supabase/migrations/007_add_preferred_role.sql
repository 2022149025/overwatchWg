-- matching_queue 테이블에 preferred_role 컬럼 추가
ALTER TABLE public.matching_queue 
ADD COLUMN IF NOT EXISTS preferred_role TEXT;

-- 컬럼 설명 추가
COMMENT ON COLUMN public.matching_queue.preferred_role IS '선호하는 상대 포지션 (돌격, 공격, 지원, 올라운더)';
