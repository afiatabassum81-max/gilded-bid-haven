ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;

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
  v_address text;
  v_is_admin boolean := false;
BEGIN
  v_email := lower(coalesce(NEW.email, ''));
  v_phone := coalesce(
    NEW.raw_user_meta_data->>'phone',
    NEW.phone,
    ''
  );
  v_address := NEW.raw_user_meta_data->>'address';

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
$function$;