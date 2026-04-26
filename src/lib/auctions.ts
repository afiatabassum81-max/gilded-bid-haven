import lotWatch from "@/assets/lot-watch.jpg";
import lotCar from "@/assets/lot-car.jpg";
import lotDagger from "@/assets/lot-dagger.jpg";
import lotRolex from "@/assets/lot-rolex.jpg";
import lotMercedes from "@/assets/lot-mercedes.jpg";
import lotVase from "@/assets/lot-vase.jpg";

export type Category = "antiques" | "cars" | "general";

export type Bid = {
  id: string;
  bidder: string;
  amount: number;
  ago: string;
};

export type Auction = {
  id: string;
  slug: string;
  title: string;
  lotNumber: string;
  category: Category;
  description: string;
  provenance: string;
  shipping: string;
  seller: string;
  startingPrice: number;
  currentBid: number;
  bidCount: number;
  watchers: number;
  endsAt: number; // epoch ms
  images: string[];
  recentBids: Bid[];
};

const now = Date.now();
const minutes = (m: number) => now + m * 60_000;
const hours = (h: number) => now + h * 60 * 60_000;

export const auctions: Auction[] = [];

export function findAuction(slug: string): Auction | undefined {
  return auctions.find((a) => a.slug === slug);
}

export const categoryLabel: Record<Category, string> = {
  antiques: "Antiques",
  cars: "Classic & Luxury Cars",
  general: "General",
};

/** Indian rupee formatting: ₹1,50,000 */
export function formatINR(value: number): string {
  return "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

/** Tiered bid increment */
export function nextIncrement(current: number): number {
  if (current < 1000) return 100;
  if (current < 10000) return 500;
  if (current < 100000) return 1000;
  return 5000;
}

export function minNextBid(current: number): number {
  return current + nextIncrement(current);
}
