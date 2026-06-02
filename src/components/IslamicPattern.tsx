/** Decorative Islamic geometric pattern (8-point star tile), rendered as SVG.
 * Used as a subtle background texture in gold line-work. */
export function IslamicPattern({
  className = "",
  opacity = 0.12,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="islamic-star"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity={opacity}
          >
            {/* 8-point star */}
            <path d="M40 8 L48 32 L72 40 L48 48 L40 72 L32 48 L8 40 L32 32 Z" />
            {/* Inner rotated square */}
            <path d="M40 16 L64 40 L40 64 L16 40 Z" />
            {/* Outer circle */}
            <circle cx="40" cy="40" r="30" />
            {/* Corner accents */}
            <circle cx="0" cy="0" r="3" />
            <circle cx="80" cy="0" r="3" />
            <circle cx="0" cy="80" r="3" />
            <circle cx="80" cy="80" r="3" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-star)" className="text-gold" />
    </svg>
  );
}

/** Decorative gold arch divider — single, minimal, mosque-inspired. */
export function ArchDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0 58 L0 40 Q0 10 30 10 Q50 10 50 30 Q50 40 60 40 Q70 40 70 30 Q70 10 100 10 Q130 10 130 30 Q130 40 140 40 Q150 40 150 30 Q150 10 170 10 Q200 10 200 40 L200 58" />
      <circle cx="100" cy="6" r="2.5" fill="currentColor" />
    </svg>
  );
}
