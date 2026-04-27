import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

/**
 * Wrap any action (bid / list buttons) with this. If the user isn't signed-in
 * or isn't WhatsApp-verified, a marble overlay covers the children with the
 * lock message and a CTA to /verify (or /login).
 */
export function LockedOverlay({ children }: { children: ReactNode }) {
  const { user, isVerified, loading } = useAuth();
  const locked = !loading && (!user || !isVerified);

  return (
    <div className="relative">
      <div className={locked ? "pointer-events-none select-none opacity-40 blur-[1px]" : ""}>
        {children}
      </div>
      {locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-sm border border-gold/40 bg-onyx/80 backdrop-blur-sm">
          <div className="px-4 text-center">
            <Lock className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ivory">
              Complete WhatsApp verification to continue
            </p>
            <Link
              to={user ? "/verify" : "/login"}
              className="mt-3 inline-flex items-center rounded-sm bg-gradient-gold-strong px-4 py-2 text-[11px] uppercase tracking-widest text-primary-foreground shadow-gold"
            >
              {user ? "Verify Now" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
