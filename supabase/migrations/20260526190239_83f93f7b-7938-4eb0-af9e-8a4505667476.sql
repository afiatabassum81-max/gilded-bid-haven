
REVOKE EXECUTE ON FUNCTION public.calculate_auction_winner(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.calculate_auction_winner(uuid) FROM anon;
-- authenticated keeps execute; function body enforces admin role
