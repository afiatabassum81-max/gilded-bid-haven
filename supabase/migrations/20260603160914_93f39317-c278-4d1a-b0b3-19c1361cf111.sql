
-- =========================================================================
-- 1. PROFILES: Stop leaking PII to every authenticated user
-- =========================================================================
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Safe public lookup for display names only (used to show "winner: <name>")
CREATE OR REPLACE FUNCTION public.get_public_display_name(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT full_name FROM public.profiles WHERE id = _user_id
$$;

REVOKE ALL ON FUNCTION public.get_public_display_name(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_public_display_name(uuid) TO authenticated, anon;

-- =========================================================================
-- 2. AUCTION_ENTRIES: Enforce that amount_paid matches the auction's entry_fee
-- =========================================================================
ALTER TABLE public.auction_entries
  DROP CONSTRAINT IF EXISTS auction_entries_amount_positive;

ALTER TABLE public.auction_entries
  ADD CONSTRAINT auction_entries_amount_positive CHECK (amount_paid > 0);

CREATE OR REPLACE FUNCTION public.validate_entry_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_required numeric;
  v_status listing_status;
BEGIN
  SELECT entry_fee, status INTO v_required, v_status
    FROM public.auction_listings WHERE id = NEW.auction_id;

  IF v_required IS NULL THEN
    RAISE EXCEPTION 'Auction not found';
  END IF;

  IF v_status NOT IN ('active'::listing_status, 'live'::listing_status, 'approved'::listing_status, 'upcoming'::listing_status) THEN
    RAISE EXCEPTION 'Auction is not open for entries';
  END IF;

  IF NEW.amount_paid < v_required THEN
    RAISE EXCEPTION 'Entry payment % is less than required entry fee %', NEW.amount_paid, v_required;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auction_entries_validate ON public.auction_entries;
CREATE TRIGGER auction_entries_validate
  BEFORE INSERT ON public.auction_entries
  FOR EACH ROW EXECUTE FUNCTION public.validate_entry_payment();

-- =========================================================================
-- 3. AUCTION_BIDS: Fix self-join bug + ensure entry is for the same auction
-- =========================================================================
DROP POLICY IF EXISTS "Users insert own bid" ON public.auction_bids;

CREATE POLICY "Users insert own bid"
  ON public.auction_bids FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.auction_listings l
      WHERE l.id = auction_bids.auction_id
        AND l.status = 'active'::listing_status
        AND (l.end_at IS NULL OR l.end_at > now())
    )
    AND EXISTS (
      SELECT 1 FROM public.auction_entries e
      WHERE e.auction_id = auction_bids.auction_id
        AND e.user_id = auth.uid()
    )
  );

-- =========================================================================
-- 4. AUCTION_LISTINGS: Public view must include 'active' status (and winner_announced for results)
-- =========================================================================
DROP POLICY IF EXISTS "Public can view approved or live listings" ON public.auction_listings;

CREATE POLICY "Public can view open or finished listings"
  ON public.auction_listings FOR SELECT
  TO authenticated
  USING (status = ANY (ARRAY[
    'approved'::listing_status,
    'live'::listing_status,
    'active'::listing_status,
    'upcoming'::listing_status,
    'paused'::listing_status,
    'closed'::listing_status,
    'winner_announced'::listing_status
  ]));

-- =========================================================================
-- 5. handle_new_user: Remove phone-based admin escalation
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_phone text;
  v_email text;
  v_age int;
  v_address text;
  v_is_admin boolean := false;
BEGIN
  v_email := lower(coalesce(NEW.email, ''));
  v_phone := coalesce(NEW.raw_user_meta_data->>'phone', NEW.phone, '');
  v_address := NEW.raw_user_meta_data->>'address';

  BEGIN
    v_age := nullif(NEW.raw_user_meta_data->>'age', '')::int;
  EXCEPTION WHEN others THEN
    v_age := NULL;
  END;

  -- Only the verified admin email is bootstrapped as admin.
  -- Phone numbers are user-supplied and NOT verified at email signup, so
  -- never grant admin based on phone metadata.
  IF v_email = 'alee.the.gem@gmail.com' THEN
    v_is_admin := true;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, age, phone, address, verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    NEW.email,
    v_age,
    nullif(v_phone, ''),
    nullif(v_address, ''),
    v_is_admin
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    age = COALESCE(EXCLUDED.age, public.profiles.age),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    address = COALESCE(EXCLUDED.address, public.profiles.address);

  IF v_is_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT DO NOTHING;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer')
    ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- =========================================================================
-- 6. Clean up any admin roles that were granted via phone-based escalation
-- =========================================================================
DELETE FROM public.user_roles
WHERE role = 'admin'
  AND user_id NOT IN (
    SELECT id FROM auth.users WHERE lower(email) = 'alee.the.gem@gmail.com'
  );
