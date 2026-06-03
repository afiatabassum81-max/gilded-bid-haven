import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, LogOut, User2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function SiteHeader() {
  const { user, profile, isVerified, loading, signOut, isAdmin, roles } = useAuth();
  const isSeller = roles.includes("seller") || isAdmin;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: Array<{ href: string; label: string }> = [
    { href: "/", label: "Home" },
    { href: "/#lots", label: "Lots" },
    { href: "/#how", label: "How It Works" },
    { href: "/#community", label: "Community" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-sm border border-gold/40 bg-onyx text-gold shadow-gold">
            <span className="font-arabic text-2xl leading-none">۞</span>
          </div>
          <div className="leading-tight">
            <div className="font-serif text-xl tracking-wide text-ivory">
              THE GILDED
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">
              A Community of Compassion
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) =>
            l.href.startsWith("/#") ? (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-gold"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        {/* Account */}
        <div className="relative">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-sm bg-card" />
          ) : !user ? (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-ivory transition-colors hover:border-gold hover:text-gold hover:shadow-gold"
            >
              Sign In
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-sm border border-gold/30 bg-card px-3 py-2 text-xs text-ivory hover:border-gold"
              >
                <User2 className="h-3.5 w-3.5 text-gold" />
                <span className="max-w-[100px] truncate">
                  {profile?.full_name ?? user.email?.split("@")[0]}
                </span>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-gold/15 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-gold">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-amber-warn/15 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-amber-warn">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                )}
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-sm border border-gold/30 bg-popover p-2 shadow-elegant"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {!isVerified && !isAdmin && (
                    <Link
                      to="/verify"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-sm px-3 py-2 text-xs uppercase tracking-widest text-amber-warn hover:bg-card"
                    >
                      Complete verification →
                    </Link>
                  )}
                  <Link
                    to="/buyer"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-sm px-3 py-2 text-xs uppercase tracking-widest text-ivory hover:bg-card"
                  >
                    My Participation
                  </Link>
                  {isSeller && (
                    <Link
                      to="/seller"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-sm px-3 py-2 text-xs uppercase tracking-widest text-ivory hover:bg-card"
                    >
                      Contribute a Lot
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-sm px-3 py-2 text-xs uppercase tracking-widest text-gold hover:bg-card"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      setMenuOpen(false);
                      await signOut();
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-xs uppercase tracking-widest text-ivory hover:bg-card"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
