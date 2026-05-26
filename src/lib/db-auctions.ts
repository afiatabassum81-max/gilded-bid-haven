import { supabase } from "@/integrations/supabase/client";

export type AuctionState =
  | "pending"
  | "approved"
  | "rejected"
  | "live"
  | "ended"
  | "upcoming"
  | "active"
  | "paused"
  | "closed"
  | "winner_announced";

export type DbAuction = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  item_condition: string | null;
  featured: boolean;
  image_url: string | null;
  gallery_urls: string[];
  video_url: string | null;
  rules: string | null;
  terms: string | null;
  entry_fee: number;
  starting_price: number;
  start_at: string | null;
  end_at: string | null;
  status: AuctionState;
  seller_id: string;
  winning_amount: number | null;
  winner_user_id: string | null;
  winner_calculated_at: string | null;
  created_at: string;
  updated_at: string;
};

const sb = supabase as any;

export async function listPublicAuctions(): Promise<DbAuction[]> {
  const { data, error } = await sb
    .from("auction_listings")
    .select("*")
    .in("status", ["upcoming", "active", "paused", "closed", "winner_announced"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbAuction[];
}

export async function getAuction(id: string): Promise<DbAuction | null> {
  const { data, error } = await sb
    .from("auction_listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as DbAuction) ?? null;
}

export async function getMyEntry(auctionId: string, userId: string) {
  const { data } = await sb
    .from("auction_entries")
    .select("*")
    .eq("auction_id", auctionId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function getMyBid(auctionId: string, userId: string) {
  const { data } = await sb
    .from("auction_bids")
    .select("*")
    .eq("auction_id", auctionId)
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function payEntry(auctionId: string, userId: string, fee: number) {
  const { error } = await sb
    .from("auction_entries")
    .insert({ auction_id: auctionId, user_id: userId, amount_paid: fee, payment_ref: `stub_${Date.now()}` });
  if (error) throw error;
}

export async function submitBid(auctionId: string, userId: string, amount: number) {
  const { error } = await sb
    .from("auction_bids")
    .insert({ auction_id: auctionId, user_id: userId, amount });
  if (error) throw error;
}

export async function getWinner(auctionId: string) {
  const { data } = await sb
    .from("auction_winners")
    .select("*")
    .eq("auction_id", auctionId)
    .maybeSingle();
  return data;
}

export function effectiveState(a: DbAuction): "upcoming" | "active" | "paused" | "closed" | "winner_announced" | "draft" {
  if (a.status === "winner_announced") return "winner_announced";
  if (a.status === "paused") return "paused";
  if (a.status === "closed" || a.status === "ended") return "closed";
  if (a.status === "active" || a.status === "live") {
    if (a.end_at && new Date(a.end_at).getTime() <= Date.now()) return "closed";
    return "active";
  }
  if (a.status === "upcoming" || a.status === "approved") {
    if (a.start_at && new Date(a.start_at).getTime() <= Date.now()) return "active";
    return "upcoming";
  }
  return "draft";
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
