-- notifications 테이블에 INSERT 정책 추가
CREATE POLICY IF NOT EXISTS "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
