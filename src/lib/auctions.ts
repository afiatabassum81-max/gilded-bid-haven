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

export const auctions: Auction[] = [
  {
    id: "1",
    slug: "ferrari-250-gt-1962",
    title: "1962 Ferrari 250 GT Berlinetta",
    lotNumber: "LOT 0042",
    category: "cars",
    description:
      "An exceptional matching-numbers example of Maranello's finest grand tourer. Comprehensive nut-and-bolt restoration completed in 2019 by marque specialists. Italian Classiche certified, Ferrari Classiche Red Book included.",
    provenance: "Single ownership 1968–2018, Tuscany.",
    shipping:
      "Enclosed transport arranged by seller, pan-India delivery. Insurance and white-glove handling included. Estimated delivery: 7–14 days post-payment.",
    seller: "Maranello Heritage Motors",
    startingPrice: 18500000,
    currentBid: 24750000,
    bidCount: 47,
    watchers: 312,
    endsAt: minutes(8),
    images: [lotCar, lotMercedes],
    recentBids: [
      { id: "b1", bidder: "rahul_m", amount: 24750000, ago: "2 mins ago" },
      { id: "b2", bidder: "vintage_collector", amount: 24500000, ago: "4 mins ago" },
      { id: "b3", bidder: "k.iyer", amount: 24000000, ago: "7 mins ago" },
      { id: "b4", bidder: "auto_baron", amount: 23500000, ago: "11 mins ago" },
      { id: "b5", bidder: "rahul_m", amount: 23000000, ago: "18 mins ago" },
    ],
  },
  {
    id: "2",
    slug: "mughal-jeweled-dagger",
    title: "Mughal-Era Jeweled Ceremonial Dagger",
    lotNumber: "LOT 0118",
    category: "antiques",
    description:
      "A magnificent 17th-century khanjar with gold-koftgari hilt set with cabochon emeralds and Burmese rubies. Watered steel blade with original gold inlay. Accompanied by a thermoluminescence dating report.",
    provenance: "Private European collection, acquired 1923.",
    shipping:
      "Insured courier with secure handling. Customs documentation included. Dispatch within 5 business days of cleared payment.",
    seller: "Ananta Antiquities, Jaipur",
    startingPrice: 850000,
    currentBid: 1450000,
    bidCount: 28,
    watchers: 184,
    endsAt: minutes(42),
    images: [lotDagger],
    recentBids: [
      { id: "b1", bidder: "heritage_h", amount: 1450000, ago: "5 mins ago" },
      { id: "b2", bidder: "raj_singh", amount: 1400000, ago: "9 mins ago" },
      { id: "b3", bidder: "meenakshi.k", amount: 1325000, ago: "16 mins ago" },
    ],
  },
  {
    id: "3",
    slug: "rolex-submariner-1680",
    title: "Vintage Rolex Submariner Ref. 1680",
    lotNumber: "LOT 0271",
    category: "general",
    description:
      "A highly collectible 1972 Submariner with original red 'Submariner' text dial. Tropical patina, original tritium plots, complete with box and papers. Recently serviced by an authorised watchmaker.",
    provenance: "Original owner, gifted upon retirement, 1973.",
    shipping:
      "Bonded courier with full insurance. Tracked dispatch within 48 hours.",
    seller: "Atelier Horloge",
    startingPrice: 425000,
    currentBid: 612500,
    bidCount: 19,
    watchers: 96,
    endsAt: hours(3),
    images: [lotRolex, lotWatch],
    recentBids: [
      { id: "b1", bidder: "horology.fan", amount: 612500, ago: "12 mins ago" },
      { id: "b2", bidder: "wristshot", amount: 600000, ago: "22 mins ago" },
    ],
  },
  {
    id: "4",
    slug: "ming-dynasty-vase",
    title: "Ming Dynasty Blue & White Porcelain Vase",
    lotNumber: "LOT 0089",
    category: "antiques",
    description:
      "A rare Wanli period meiping vase with cobalt-blue underglaze decoration of peonies and mythical beasts. Excellent condition with minor age-related kiln spots. Six-character mark to base.",
    provenance: "Sotheby's Hong Kong, 2004.",
    shipping: "Custom crating with climate-controlled transport. 7–10 days.",
    seller: "Orient Heritage House",
    startingPrice: 1200000,
    currentBid: 1875000,
    bidCount: 33,
    watchers: 221,
    endsAt: minutes(56),
    images: [lotVase],
    recentBids: [
      { id: "b1", bidder: "porcelain_p", amount: 1875000, ago: "3 mins ago" },
      { id: "b2", bidder: "asian_arts", amount: 1825000, ago: "8 mins ago" },
    ],
  },
  {
    id: "5",
    slug: "antique-pocket-watch",
    title: "19th Century Engraved Gold Pocket Watch",
    lotNumber: "LOT 0156",
    category: "antiques",
    description:
      "An exquisite 18k yellow gold half-hunter pocket watch with intricate hand-engraved case, Swiss lever movement, and original enamel dial. Working order, recently serviced.",
    provenance: "Estate of a Bombay merchant family.",
    shipping: "Registered insured post within India. 3–5 business days.",
    seller: "Heritage Horology",
    startingPrice: 95000,
    currentBid: 142000,
    bidCount: 14,
    watchers: 67,
    endsAt: hours(6),
    images: [lotWatch],
    recentBids: [
      { id: "b1", bidder: "tic_toc", amount: 142000, ago: "20 mins ago" },
      { id: "b2", bidder: "estate_buyer", amount: 138000, ago: "35 mins ago" },
    ],
  },
  {
    id: "6",
    slug: "mercedes-300sl-gullwing",
    title: "1956 Mercedes-Benz 300 SL Gullwing",
    lotNumber: "LOT 0007",
    category: "cars",
    description:
      "An icon of post-war automotive design. Concours-restored example finished in original Silver Metallic over red leather. Matching numbers, Mercedes-Benz Classic Center documented.",
    provenance: "Three owners from new, German originally delivered.",
    shipping: "Worldwide enclosed transport. Customs assistance provided.",
    seller: "Stuttgart Klassik",
    startingPrice: 95000000,
    currentBid: 112500000,
    bidCount: 22,
    watchers: 488,
    endsAt: hours(11),
    images: [lotMercedes, lotCar],
    recentBids: [
      { id: "b1", bidder: "gullwing_gp", amount: 112500000, ago: "28 mins ago" },
      { id: "b2", bidder: "concours.k", amount: 110000000, ago: "1 hr ago" },
    ],
  },
];

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
