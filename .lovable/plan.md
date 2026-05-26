This is a large spec — proposing a phased plan. I recommend approving phase 1 (the auction engine + entry fees) first, then we tackle the rest. Trying to ship everything in one pass will be unstable.

## Phase 1 — Custom Auction Engine + Entry Fee (core business logic)

### Database (new + extended tables)
- Extend `auction_listings`: add `start_at`, `end_at`, `entry_fee` (default 100, min 100), `condition`, `featured`, `gallery_urls[]`, `video_url`, `rules`, `terms`, `state` enum (`upcoming|active|paused|closed|winner_announced`), `winning_amount`, `winner_user_id`, `winner_calculated_at`.
- New `auction_bids`: `id, auction_id, user_id, amount (numeric), created_at (timestamptz with ms)`. Unique `(auction_id, user_id)` — one bid per user, immutable.
- New `auction_entries`: `id, auction_id, user_id, amount_paid, paid_at, payment_ref`. Unique `(auction_id, user_id)`. Gates bid submission.
- New `auction_winners`: snapshot of winner result + full frequency breakdown JSON for audit.
- RLS: bids invisible to everyone except admin during active auction; users see only their own bid. Winner row public after `winner_announced`.
- GRANTs on all new public tables for `authenticated` + `service_role`.

### Winner algorithm (Postgres function `calculate_auction_winner(auction_id)`)
1. Group bids by amount, count participants.
2. Find min count → candidate amounts.
3. Among ties, pick lowest amount.
4. Among bidders at that amount, pick earliest `created_at`.
5. Write to `auction_winners`, set listing `state='winner_announced'`, store `winning_amount` + `winner_user_id`.
- Triggered: (a) admin "Close & calculate" button via server fn, (b) pg_cron job every minute that closes auctions past `end_at`.

### Server functions (`src/lib/auctions.functions.ts`)
- `payEntryFee(auctionId)` — records entry (payment integration deferred; for now marks as paid so flow works end-to-end).
- `submitBid(auctionId, amount)` — checks entry exists, no prior bid, auction `active`, inserts immutably.
- `getMyBid(auctionId)`, `getMyEntries()`.
- Admin-only: `createAuction`, `updateAuction`, `pauseAuction`, `resumeAuction`, `extendAuction(minutes)`, `closeAuctionNow`, `publishWinner`, `getBidAnalytics(auctionId)`.

### Frontend
- Auction detail page rewritten: remove eBay-style "current bid / leading / bid history". Show only: item info, countdown to `end_at`, entry fee CTA, single bid input (locked until entry paid), confirmation modal with "Submitted bids cannot be modified…", post-submission "Your bid is locked" state. No visibility into other bids.
- Countdown: D/H/M/S live ticker.
- States: Upcoming (shows start countdown), Active (bid form), Paused (notice), Closed (awaiting result), Winner Announced (winning amount + winner name).
- Privacy: hide all frequency/leader UI during active state.

### Admin panel additions
- New "Auctions" tab: create form (all spec fields, manual start/end date+time), list with state controls (pause/resume/extend/close/publish).
- New "Bid Analytics" view per auction: frequency table, timestamps, full audit (admin only).

## Phase 2 — Community + Dashboards + Visual Refresh
- Homepage mission section, community stats (live counts from DB), announcements table, success stories, social impact section — all admin-editable.
- User dashboard expansion: active/upcoming/participated/won tabs, payment history, receipts.
- Admin: community content management, payment reports, platform analytics.
- Visual refresh: subtle Islamic geometric motifs (SVG patterns in borders/dividers), refined typography pass, mobile-first audit.

## Phase 3 — Payments + Security hardening
- Real payment integration for entry fees (Stripe via Lovable Payments — recommend after phase 1 lands).
- Rate limiting on bid endpoint, audit log table, fraud signals (duplicate accounts by phone/IP).
- Downloadable PDF receipts.

## Technical notes (for reference)
- Bid amount stored as `numeric(12,2)`; timestamps `timestamptz` (Postgres has microsecond precision, exceeds millisecond requirement).
- Algorithm runs in a single SQL CTE for atomicity.
- pg_cron + `net.http_post` to a `/api/public/hooks/close-auctions` route to auto-close expired auctions.
- Entry fee in Phase 1 is a "mark as paid" stub so the flow is testable; real Stripe wiring in Phase 3 to avoid blocking on payment provider setup.

---

**Recommendation:** approve Phase 1 only. It's already a large migration + ~6 new server functions + rewritten auction page + admin auction CRUD. Once that's solid we move to Phase 2.

Reply "approve phase 1" to proceed, or tell me what to adjust.