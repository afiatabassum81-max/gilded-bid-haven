
ALTER TYPE public.listing_status ADD VALUE IF NOT EXISTS 'upcoming';
ALTER TYPE public.listing_status ADD VALUE IF NOT EXISTS 'active';
ALTER TYPE public.listing_status ADD VALUE IF NOT EXISTS 'paused';
ALTER TYPE public.listing_status ADD VALUE IF NOT EXISTS 'closed';
ALTER TYPE public.listing_status ADD VALUE IF NOT EXISTS 'winner_announced';
