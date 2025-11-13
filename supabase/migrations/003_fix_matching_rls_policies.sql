-- 기존 제한적인 RLS 정책 삭제 및 새로운 정책 추가

-- 1. user_profiles: 모든 사용자가 다른 사용자의 프로필을 볼 수 있어야 함 (매칭을 위해)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

-- 2. matching_queue: 모든 사용자가 대기열을 볼 수 있어야 함 (매칭을 위해)
DROP POLICY IF EXISTS "Users can view own queue" ON public.matching_queue;
CREATE POLICY "Users can view all queues" ON public.matching_queue
  FOR SELECT USING (true);

-- 3. matching_queue: 삭제 권한 추가 (대기열 취소 및 매칭 완료 시 삭제를 위해)
CREATE POLICY "Users can delete own queue" ON public.matching_queue
  FOR DELETE USING (auth.uid() = user_id);

-- 4. matches: INSERT 권한 추가 (매칭 생성을 위해)
CREATE POLICY "Users can create matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 5. notifications: 다른 사용자에게 알림을 생성할 수 있어야 함
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
CREATE POLICY "Users can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- 6. notifications: 삭제 권한 추가
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);
