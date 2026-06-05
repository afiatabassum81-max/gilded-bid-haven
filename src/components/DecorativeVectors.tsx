/** Decorative SVG vector art elements for The Gilded.
 * All purely decorative: stroke-only, gold (#c9a84c), no fills.
 * Consumers wrap them in absolutely-positioned, pointer-events-none containers. */

const GOLD = "#c9a84c";

/** ELEMENT 1 — Grand domed interior hall, Mughal/Ottoman inspired. */
export function DomedHallVector({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={GOLD}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Floor / perspective */}
      <path d="M0 540 L1200 540" />
      <path d="M200 540 L600 380 L1000 540" />
      <path d="M100 540 L600 340 L1100 540" />
      <path d="M0 540 L600 320 L1200 540" />

      {/* Central dome */}
      <path d="M450 240 Q600 60 750 240" />
      <path d="M470 240 Q600 90 730 240" />
      <path d="M490 240 Q600 120 710 240" />
      {/* Finial */}
      <path d="M600 60 L600 30" />
      <circle cx="600" cy="22" r="6" />
      <circle cx="600" cy="10" r="2.5" />

      {/* Dome base drum with arched windows */}
      <path d="M440 240 L760 240" />
      <path d="M440 280 L760 280" />
      <path d="M470 280 L470 250 Q470 244 478 244 Q486 244 486 250 L486 280" />
      <path d="M520 280 L520 250 Q520 244 528 244 Q536 244 536 250 L536 280" />
      <path d="M570 280 L570 250 Q570 244 578 244 Q586 244 586 250 L586 280" />
      <path d="M620 280 L620 250 Q620 244 628 244 Q636 244 636 250 L636 280" />
      <path d="M670 280 L670 250 Q670 244 678 244 Q686 244 686 250 L686 280" />
      <path d="M720 280 L720 250 Q720 244 728 244 Q736 244 736 250 L736 280" />

      {/* Central grand arch */}
      <path d="M430 540 L430 380 Q430 280 600 280 Q770 280 770 380 L770 540" />
      <path d="M450 540 L450 380 Q450 300 600 300 Q750 300 750 380 L750 540" />

      {/* Inner arch hairlines */}
      <path d="M480 540 L480 380 Q480 320 600 320 Q720 320 720 380 L720 540" />

      {/* Left colonnade */}
      <ColonnadeArch x={80} y={540} />
      <ColonnadeArch x={200} y={540} />
      <ColonnadeArch x={320} y={540} />

      {/* Right colonnade */}
      <ColonnadeArch x={800} y={540} />
      <ColonnadeArch x={920} y={540} />
      <ColonnadeArch x={1040} y={540} />

      {/* Side small domes */}
      <path d="M120 380 Q160 320 200 380" />
      <path d="M240 380 Q280 320 320 380" />
      <path d="M360 380 Q400 320 440 380" />
      <path d="M760 380 Q800 320 840 380" />
      <path d="M880 380 Q920 320 960 380" />
      <path d="M1000 380 Q1040 320 1080 380" />

      {/* Top horizontal beam */}
      <path d="M40 380 L1160 380" />
      <path d="M40 376 L1160 376" />

      {/* Decorative central medallion */}
      <circle cx="600" cy="450" r="22" />
      <circle cx="600" cy="450" r="14" />
      <path d="M600 428 L600 472 M578 450 L622 450 M584 434 L616 466 M616 434 L584 466" />
    </svg>
  );
}

function ColonnadeArch({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Pillar pair */}
      <path d={`M${x} ${y} L${x} ${y - 160}`} />
      <path d={`M${x + 80} ${y} L${x + 80} ${y - 160}`} />
      {/* Capitals */}
      <path d={`M${x - 6} ${y - 160} L${x + 6} ${y - 160}`} />
      <path d={`M${x + 74} ${y - 160} L${x + 86} ${y - 160}`} />
      {/* Arch */}
      <path d={`M${x} ${y - 160} Q${x + 40} ${y - 210} ${x + 80} ${y - 160}`} />
      <path d={`M${x + 8} ${y - 160} Q${x + 40} ${y - 200} ${x + 72} ${y - 160}`} />
      {/* Base */}
      <path d={`M${x - 8} ${y} L${x + 8} ${y}`} />
      <path d={`M${x + 72} ${y} L${x + 88} ${y}`} />
    </g>
  );
}

/** ELEMENT 2 — 8-point Islamic star medallion built from interlocking polygons. */
export function StarMedallionVector({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={GOLD}
      strokeWidth="0.7"
      strokeLinejoin="round"
    >
      <g transform="translate(200 200)">
        {/* Outer circle */}
        <circle r="190" />
        <circle r="180" />

        {/* Two interlocking squares forming 8-point star */}
        <path d="M-160 -160 L160 -160 L160 160 L-160 160 Z" />
        <path d="M0 -226 L160 -66 L226 0 L160 66 L0 226 L-160 66 L-226 0 L-160 -66 Z"
          transform="scale(0.7)" />
        <path d="M0 -160 L113 -113 L160 0 L113 113 L0 160 L-113 113 L-160 0 L-113 -113 Z" />
        <path d="M0 -160 L113 -113 L160 0 L113 113 L0 160 L-113 113 L-160 0 L-113 -113 Z"
          transform="rotate(22.5)" />

        {/* Inner octagons */}
        <path d="M0 -100 L70 -70 L100 0 L70 70 L0 100 L-70 70 L-100 0 L-70 -70 Z" />
        <path d="M0 -100 L70 -70 L100 0 L70 70 L0 100 L-70 70 L-100 0 L-70 -70 Z"
          transform="rotate(22.5)" />

        {/* Inner star */}
        <path d="M0 -60 L42 -42 L60 0 L42 42 L0 60 L-42 42 L-60 0 L-42 -42 Z" />
        <path d="M0 -60 L42 -42 L60 0 L42 42 L0 60 L-42 42 L-60 0 L-42 -42 Z"
          transform="rotate(22.5)" />

        {/* Center */}
        <circle r="28" />
        <circle r="14" />

        {/* Radial petals between rings */}
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d="M0 -100 L0 -160"
            transform={`rotate(${(360 / 16) * i})`}
          />
        ))}

        {/* Outer points to circle */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d="M0 -160 L0 -190"
            transform={`rotate(${(360 / 8) * i})`}
          />
        ))}
      </g>
    </svg>
  );
}

/** ELEMENT 3 — Two open cupped hands (dua / giving gesture). */
export function GivingHandsVector({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 500 360"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={GOLD}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Soft glow above (light from above) */}
      <circle cx="250" cy="40" r="14" />
      <path d="M250 10 L250 0 M250 80 L250 90 M220 40 L210 40 M280 40 L290 40 M228 18 L222 12 M272 18 L278 12 M228 62 L222 68 M272 62 L278 68" />

      {/* LEFT HAND */}
      <g>
        {/* Wrist / forearm */}
        <path d="M30 340 L70 230" />
        <path d="M80 340 L120 240" />
        {/* Palm bowl */}
        <path d="M70 230 Q90 170 150 160 Q210 158 240 200 Q250 215 250 240" />
        {/* Thumb */}
        <path d="M70 230 Q60 200 78 180 Q92 170 105 185" />
        {/* Fingers */}
        <path d="M150 160 L145 110 Q145 100 152 100 Q160 100 160 110 L162 162" />
        <path d="M178 158 L176 100 Q176 90 184 90 Q192 90 192 100 L194 160" />
        <path d="M206 162 L208 108 Q208 98 216 98 Q224 98 224 108 L222 168" />
        <path d="M232 172 L240 122 Q242 112 250 114 Q258 116 256 126 L248 180" />
      </g>

      {/* RIGHT HAND (mirrored) */}
      <g transform="translate(500 0) scale(-1 1)">
        <path d="M30 340 L70 230" />
        <path d="M80 340 L120 240" />
        <path d="M70 230 Q90 170 150 160 Q210 158 240 200 Q250 215 250 240" />
        <path d="M70 230 Q60 200 78 180 Q92 170 105 185" />
        <path d="M150 160 L145 110 Q145 100 152 100 Q160 100 160 110 L162 162" />
        <path d="M178 158 L176 100 Q176 90 184 90 Q192 90 192 100 L194 160" />
        <path d="M206 162 L208 108 Q208 98 216 98 Q224 98 224 108 L222 168" />
        <path d="M232 172 L240 122 Q242 112 250 114 Q258 116 256 126 L248 180" />
      </g>

      {/* Connecting valley between palms */}
      <path d="M240 210 Q250 230 260 210" />
    </svg>
  );
}

/** ELEMENT 4 — 12-pointed Islamic compass rose. */
export function CompassRoseVector({
  className = "",
  strokeWidth = 0.75,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={GOLD}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    >
      <g transform="translate(200 200)">
        <circle r="190" />
        <circle r="170" />
        <circle r="120" />
        <circle r="80" />
        <circle r="40" />
        <circle r="14" />

        {/* 12 long points */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`p-${i}`} transform={`rotate(${(360 / 12) * i})`}>
            <path d="M0 -190 L14 -120 L0 -80 L-14 -120 Z" />
            <path d="M0 -190 L0 -14" />
          </g>
        ))}

        {/* 12 short interstitial points */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`s-${i}`} transform={`rotate(${(360 / 12) * i + 15})`}>
            <path d="M0 -140 L8 -90 L0 -60 L-8 -90 Z" />
          </g>
        ))}

        {/* Inner 12-point star */}
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={`i-${i}`}
            d="M0 -80 L10 -40 L0 0 L-10 -40 Z"
            transform={`rotate(${(360 / 12) * i})`}
          />
        ))}
      </g>
    </svg>
  );
}
