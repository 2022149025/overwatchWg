-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matching_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
