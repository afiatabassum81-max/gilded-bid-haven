
ALTER TABLE public.auction_listings
  ADD COLUMN IF NOT EXISTS start_at timestamptz,
  ADD COLUMN IF NOT EXISTS end_at timestamptz,
  ADD COLUMN IF NOT EXISTS entry_fee numeric(12,2) NOT NULL DEFAULT 100 CHECK (entry_fee >= 100),
  ADD COLUMN IF NOT EXISTS item_condition text,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS rules text,
  ADD COLUMN IF NOT EXISTS terms text,
  ADD COLUMN IF NOT EXISTS winning_amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS winner_user_id uuid,
  ADD COLUMN IF NOT EXISTS winner_calculated_at timestamptz;

-- auction_entries first (bid policy references it)
CREATE TABLE IF NOT EXISTS public.auction_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid NOT NULL REFERENCES public.auction_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount_paid numeric(12,2) NOT NULL,
  payment_ref text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (auction_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_auction_entries_auction ON public.auction_entries(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_entries_user ON public.auction_entries(user_id);
GRANT SELECT, INSERT ON public.auction_entries TO authenticated;
GRANT ALL ON public.auction_entries TO service_role;
ALTER TABLE public.auction_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own entries" ON public.auction_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all entries" ON public.auction_entries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users create own entry" ON public.auction_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- auction_bids
CREATE TABLE IF NOT EXISTS public.auction_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid NOT NULL REFERENCES public.auction_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE (auction_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction ON public.auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_user ON public.auction_bids(user_id);
GRANT SELECT, INSERT ON public.auction_bids TO authenticated;
GRANT ALL ON public.auction_bids TO service_role;
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bids" ON public.auction_bids FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all bids" ON public.auction_bids FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public view bids after winner announced" ON public.auction_bids FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.auction_listings l WHERE l.id = auction_id AND l.status = 'winner_announced'::listing_status));
CREATE POLICY "Users insert own bid" ON public.auction_bids FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.auction_listings l WHERE l.id = auction_id AND l.status = 'active'::listing_status AND (l.end_at IS NULL OR l.end_at > now()))
    AND EXISTS (SELECT 1 FROM public.auction_entries e WHERE e.auction_id = auction_id AND e.user_id = auth.uid())
  );

-- auction_winners
CREATE TABLE IF NOT EXISTS public.auction_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid NOT NULL UNIQUE REFERENCES public.auction_listings(id) ON DELETE CASCADE,
  winner_user_id uuid NOT NULL,
  winning_amount numeric(12,2) NOT NULL,
  frequency_breakdown jsonb NOT NULL,
  total_bids integer NOT NULL,
  total_participants integer NOT NULL,
  calculated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.auction_winners TO authenticated;
GRANT SELECT ON public.auction_winners TO anon;
GRANT ALL ON public.auction_winners TO service_role;
ALTER TABLE public.auction_winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view winners" ON public.auction_winners FOR SELECT USING (true);
CREATE POLICY "Admins manage winners" ON public.auction_winners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.calculate_auction_winner(_auction_id uuid)
RETURNS TABLE (winning_amount numeric, winner_user_id uuid, total_bids int, total_participants int)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_win_amount numeric;
  v_winner uuid;
  v_total_bids int;
  v_total_participants int;
  v_freq jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can calculate winners';
  END IF;

  SELECT count(*), count(DISTINCT user_id) INTO v_total_bids, v_total_participants
    FROM public.auction_bids WHERE auction_id = _auction_id;

  IF v_total_bids = 0 THEN
    RAISE EXCEPTION 'No bids to calculate winner';
  END IF;

  SELECT amount INTO v_win_amount FROM (
    SELECT amount, count(*) AS participants FROM public.auction_bids
    WHERE auction_id = _auction_id GROUP BY amount
  ) g ORDER BY participants ASC, amount ASC LIMIT 1;

  SELECT user_id INTO v_winner FROM public.auction_bids
    WHERE auction_id = _auction_id AND amount = v_win_amount
    ORDER BY created_at ASC LIMIT 1;

  SELECT jsonb_agg(jsonb_build_object('amount', amount, 'participants', participants) ORDER BY participants ASC, amount ASC)
    INTO v_freq FROM (
      SELECT amount, count(*) AS participants FROM public.auction_bids
      WHERE auction_id = _auction_id GROUP BY amount
    ) g;

  INSERT INTO public.auction_winners (auction_id, winner_user_id, winning_amount, frequency_breakdown, total_bids, total_participants)
  VALUES (_auction_id, v_winner, v_win_amount, v_freq, v_total_bids, v_total_participants)
  ON CONFLICT (auction_id) DO UPDATE SET
    winner_user_id = EXCLUDED.winner_user_id,
    winning_amount = EXCLUDED.winning_amount,
    frequency_breakdown = EXCLUDED.frequency_breakdown,
    total_bids = EXCLUDED.total_bids,
    total_participants = EXCLUDED.total_participants,
    calculated_at = now();

  UPDATE public.auction_listings
    SET status = 'winner_announced'::listing_status,
        winning_amount = v_win_amount,
        winner_user_id = v_winner,
        winner_calculated_at = now()
    WHERE id = _auction_id;

  RETURN QUERY SELECT v_win_amount, v_winner, v_total_bids, v_total_participants;
END;
$$;

GRANT EXECUTE ON FUNCTION public.calculate_auction_winner(uuid) TO authenticated;
