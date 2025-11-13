-- 안전하게 RLS 정책 수정 (이미 존재하는 정책은 건너뛰기)

-- 1. user_profiles: 모든 사용자가 프로필 조회 가능
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can view all profiles'
  ) THEN
    DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
    CREATE POLICY "Users can view all profiles" ON public.user_profiles
      FOR SELECT USING (true);
  END IF;
END $$;

-- 2. matching_queue: 모든 사용자가 대기열 조회 가능
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'matching_queue' 
    AND policyname = 'Users can view all queues'
  ) THEN
    DROP POLICY IF EXISTS "Users can view own queue" ON public.matching_queue;
    CREATE POLICY "Users can view all queues" ON public.matching_queue
      FOR SELECT USING (true);
  END IF;
END $$;

-- 3. matching_queue: 삭제 권한 추가
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'matching_queue' 
    AND policyname = 'Users can delete own queue'
  ) THEN
    CREATE POLICY "Users can delete own queue" ON public.matching_queue
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 4. matches: INSERT 권한 추가
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'matches' 
    AND policyname = 'Users can create matches'
  ) THEN
    CREATE POLICY "Users can create matches" ON public.matches
      FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
  END IF;
END $$;

-- 5. notifications: 모든 사용자가 알림 생성 가능
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Users can insert notifications'
  ) THEN
    DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
    CREATE POLICY "Users can insert notifications" ON public.notifications
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 6. notifications: 삭제 권한 추가
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Users can delete own notifications'
  ) THEN
    CREATE POLICY "Users can delete own notifications" ON public.notifications
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
