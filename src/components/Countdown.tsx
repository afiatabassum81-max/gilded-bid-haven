import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  endsAt: number;
  className?: string;
  compact?: boolean;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Countdown({ endsAt, className, compact }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, endsAt - now);
  const ended = remaining === 0;

  const totalSec = Math.floor(remaining / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  const critical = remaining > 0 && remaining <= 60_000;
  const warning = remaining > 60_000 && remaining <= 5 * 60_000;

  const tone = ended
    ? "text-muted-foreground"
    : critical
      ? "text-destructive"
      : warning
        ? "text-amber-warn"
        : "text-gold";

  if (compact) {
    return (
      <span
        className={cn(
          "font-mono text-sm tabular-nums tracking-wider",
          tone,
          critical && "animate-pulse",
          className,
        )}
      >
        {ended
          ? "ENDED"
          : days > 0
            ? `${days}d ${pad(hours)}h ${pad(mins)}m`
            : `${pad(hours)}:${pad(mins)}:${pad(secs)}`}
      </span>
    );
  }

  if (ended) {
    return (
      <div className={cn("font-serif text-2xl text-muted-foreground", className)}>
        Auction Ended
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[
        { v: days, l: "Days" },
        { v: hours, l: "Hrs" },
        { v: mins, l: "Min" },
        { v: secs, l: "Sec" },
      ].map((u, i) => (
        <div
          key={u.l}
          className={cn(
            "flex min-w-[3.5rem] flex-col items-center rounded border px-3 py-2 transition-colors",
            critical
              ? "border-destructive/60 bg-destructive/10"
              : warning
                ? "border-amber-warn/60 bg-amber-warn/10"
                : "border-gold/30 bg-card/60",
            critical && "animate-pulse",
          )}
        >
          <span className={cn("font-mono text-2xl font-semibold tabular-nums", tone)}>
            {pad(u.v)}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {u.l}
          </span>
          {i < 3 && null}
        </div>
      ))}
    </div>
  );
}
