export default function EmptyStateIllustration() {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-40 sm:w-56 sm:h-56"
    >
      {/* soft outer glow */}
      <circle cx="110" cy="110" r="100" fill="#0F5C66" fillOpacity="0.05" />
      <circle cx="110" cy="110" r="72" fill="#0F5C66" fillOpacity="0.08" />

      {/* target / bullseye */}
      <circle cx="110" cy="110" r="46" stroke="#0F5C66" strokeWidth="2.5" fill="none" />
      <circle cx="110" cy="110" r="32" stroke="#0F5C66" strokeWidth="2.5" fill="none" />
      <circle cx="110" cy="110" r="18" stroke="#0F5C66" strokeWidth="2.5" fill="none" />
      <circle cx="110" cy="110" r="6" fill="#0F5C66" />

      {/* star badge (top-left) — lucide "star" outline, amber/gold */}
      <g transform="translate(48, 52) scale(0.85)">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
          fill="none"
          stroke="#D9A526"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>

      {/* check-circle badge (top-right) — outline only, muted teal/gray */}
      <g transform="translate(150, 54) scale(0.85)">
        <circle cx="12" cy="12" r="10" stroke="#7C9CA3" strokeWidth="1.8" fill="none" />
        <path d="M8 12.3l2.6 2.6L16.2 9" stroke="#7C9CA3" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* star-off badge (bottom-right) — same star shape, crossed out, amber/orange */}
      <g transform="translate(148, 148) scale(0.85)">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
          fill="none"
          stroke="#D9822B"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path d="M2.5 2.5l19 19" stroke="#D9822B" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  )
}