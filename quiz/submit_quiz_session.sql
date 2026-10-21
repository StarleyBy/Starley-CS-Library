-- =============================================================================
-- STARLEY MEDICAL LIBRARY — ATOMIC QUIZ SESSION SUBMISSION (RPC)
-- Выполнить в: Supabase Dashboard → SQL Editor → New query → Run
-- 
-- Решает проблему неатомарной записи результатов тестирования (Broken Quiz Attempts).
-- Сохраняет сессию и ответы единой транзакцией PostgreSQL.
-- =============================================================================

-- 1. Таблица quiz_answers (если ещё не создана)
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  is_correct boolean NOT NULL,
  chosen_option int,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Индекс для быстрого поиска ответов по сессии
CREATE INDEX IF NOT EXISTS idx_quiz_answers_session_id ON public.quiz_answers(session_id);

-- Включение Row Level Security
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- RLS Политики
DROP POLICY IF EXISTS "quiz_answers_select_own" ON public.quiz_answers;
CREATE POLICY "quiz_answers_select_own" ON public.quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions qs
      WHERE qs.id = quiz_answers.session_id AND qs.user_id = auth.uid()
    ) OR public.is_admin()
  );

DROP POLICY IF EXISTS "quiz_answers_insert_own" ON public.quiz_answers;
CREATE POLICY "quiz_answers_insert_own" ON public.quiz_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_sessions qs
      WHERE qs.id = quiz_answers.session_id AND qs.user_id = auth.uid()
    ) OR public.is_admin()
  );

-- 2. Хранимая функция submit_quiz_session
CREATE OR REPLACE FUNCTION public.submit_quiz_session(
  p_session_data jsonb,
  p_answers_data jsonb DEFAULT '[]'::jsonb
) RETURNS uuid AS $$
DECLARE
  v_session_id uuid;
  v_user_id uuid;
BEGIN
  -- Определяем user_id: из auth.uid() либо из переданных данных
  v_user_id := COALESCE(auth.uid(), (p_session_data->>'user_id')::uuid);

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Атомарная вставка сессии
  INSERT INTO public.quiz_sessions (
    user_id,
    session_id,
    date,
    set_title,
    mode,
    lang,
    total_q,
    correct_q,
    score_pct,
    time_spent_sec,
    exp_gained,
    topics,
    detail_summary
  )
  VALUES (
    v_user_id,
    COALESCE(p_session_data->>'session_id', 'sess_' || extract(epoch from now())::bigint),
    COALESCE((p_session_data->>'date')::timestamptz, now()),
    COALESCE(p_session_data->>'set_title', p_session_data->>'deck_id', 'Quiz Session'),
    COALESCE(p_session_data->>'mode', 'smart'),
    COALESCE(p_session_data->>'lang', 'En'),
    COALESCE((p_session_data->>'total_q')::int, (p_session_data->>'total')::int, 0),
    COALESCE((p_session_data->>'correct_q')::int, (p_session_data->>'score')::int, 0),
    COALESCE((p_session_data->>'score_pct')::numeric, 0),
    COALESCE((p_session_data->>'time_spent_sec')::int, (p_session_data->>'duration')::int, 0),
    COALESCE((p_session_data->>'exp_gained')::int, 0),
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(p_session_data->'topics', '[]'::jsonb))),
    p_session_data->>'detail_summary'
  )
  ON CONFLICT (user_id, session_id) DO UPDATE SET
    score_pct = EXCLUDED.score_pct,
    correct_q = EXCLUDED.correct_q,
    total_q = EXCLUDED.total_q,
    detail_summary = COALESCE(EXCLUDED.detail_summary, quiz_sessions.detail_summary)
  RETURNING id INTO v_session_id;

  -- 2. Вставка детализации ответов в той же транзакции
  IF p_answers_data IS NOT NULL AND jsonb_array_length(p_answers_data) > 0 THEN
    BEGIN
      INSERT INTO public.quiz_answers (session_id, question_id, is_correct, chosen_option)
      SELECT 
        v_session_id,
        item->>'question_id',
        (item->>'is_correct')::boolean,
        (item->>'chosen_option')::int
      FROM jsonb_array_elements(p_answers_data) AS item;
    EXCEPTION WHEN undefined_table THEN
      NULL; -- Если таблица quiz_answers отсутствует, сессия все равно сохраняется
    END IF;
  END IF;

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
