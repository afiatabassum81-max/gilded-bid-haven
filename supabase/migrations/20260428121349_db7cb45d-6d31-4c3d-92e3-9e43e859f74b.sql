-- Add phone to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Update handle_new_user to populate full_name, age, phone from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_phone text;
  v_email text;
  v_age int;
  v_is_admin boolean := false;
BEGIN
  v_email := lower(coalesce(NEW.email, ''));
  v_phone := coalesce(
    NEW.raw_user_meta_data->>'phone',
    NEW.phone,
    ''
  );

  BEGIN
    v_age := nullif(NEW.raw_user_meta_data->>'age', '')::int;
  EXCEPTION WHEN others THEN
    v_age := NULL;
  END;

  IF v_email = 'alee.the.gem@gmail.com'
     OR v_phone IN ('7799191019', '+917799191019', '917799191019',
                    '9885819302', '+919885819302', '919885819302') THEN
    v_is_admin := true;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, age, phone, verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    NEW.email,
    v_age,
    nullif(v_phone, ''),
    v_is_admin
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    age = COALESCE(EXCLUDED.age, public.profiles.age),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone);

  IF v_is_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT DO NOTHING;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer')
    ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure profile updated_at trigger exists for verification protection
DROP TRIGGER IF EXISTS profiles_prevent_self_verify ON public.profiles;
CREATE TRIGGER profiles_prevent_self_verify
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_verification();