
-- 1. auction_listings table
CREATE TYPE public.listing_status AS ENUM ('pending', 'approved', 'rejected', 'live', 'ended');

CREATE TABLE public.auction_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  starting_price numeric(12,2) NOT NULL DEFAULT 0,
  image_url text,
  status public.listing_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.auction_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved or live listings"
  ON public.auction_listings FOR SELECT
  TO authenticated
  USING (status IN ('approved', 'live'));

CREATE POLICY "Sellers view their own listings"
  ON public.auction_listings FOR SELECT
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers create their own listings"
  ON public.auction_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers update their own pending listings"
  ON public.auction_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id AND status = 'pending')
  WITH CHECK (auth.uid() = seller_id AND status = 'pending');

CREATE POLICY "Admins view all listings"
  ON public.auction_listings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update any listing"
  ON public.auction_listings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete any listing"
  ON public.auction_listings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_auction_listings_updated
  BEFORE UPDATE ON public.auction_listings
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_verification();
-- ^ note: prevent_self_verification just bumps updated_at when verified isn't changing; safe here.

-- 2. Update handle_new_user to auto-admin the two accounts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_phone text;
  v_email text;
  v_is_admin boolean := false;
BEGIN
  v_email := lower(coalesce(NEW.email, ''));
  v_phone := coalesce(NEW.phone, NEW.raw_user_meta_data->>'phone', '');

  IF v_email = 'alee.the.gem@gmail.com'
     OR v_phone IN ('7799191019', '+917799191019', '917799191019',
                    '9885819302', '+919885819302', '919885819302') THEN
    v_is_admin := true;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    NEW.email,
    v_is_admin
  );

  IF v_is_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT DO NOTHING;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer')
    ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;

-- 3. Backfill: grant admin to existing matching users
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT id FROM auth.users
    WHERE lower(coalesce(email,'')) = 'alee.the.gem@gmail.com'
       OR coalesce(phone,'') IN ('7799191019','+917799191019','917799191019',
                                  '9885819302','+919885819302','919885819302')
  LOOP
    INSERT INTO public.user_roles (user_id, role) VALUES (r.id, 'admin')
      ON CONFLICT DO NOTHING;
    UPDATE public.profiles SET verified = true WHERE id = r.id;
  END LOOP;
END $$;
