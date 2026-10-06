export function Sparkle({ className = "", size = 16 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function Bow({ className = "", size = 80 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 84" width={size} height={(size * 84) / 120} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bowg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd3e3" />
          <stop offset=".5" stopColor="#f48fb6" />
          <stop offset="1" stopColor="#d6336c" />
        </linearGradient>
      </defs>
      <path d="M55 44 L38 80 L48 75 L56 82 L60 46Z" fill="url(#bowg)" />
      <path d="M65 44 L82 80 L72 75 L64 82 L60 46Z" fill="url(#bowg)" />
      <path d="M60 40 C40 8 6 6 8 30 C10 52 40 52 60 42Z" fill="url(#bowg)" />
      <path d="M60 40 C80 8 114 6 112 30 C110 52 80 52 60 42Z" fill="url(#bowg)" />
      <path d="M22 24 C30 16 42 20 50 30" stroke="#fff" strokeOpacity=".7" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M98 24 C90 16 78 20 70 30" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="41" rx="9" ry="11" fill="#d6336c" />
      <ellipse cx="57" cy="37" rx="3" ry="4" fill="#fff" fillOpacity=".5" />
    </svg>
  );
}

export function Heart({ className = "", size = 16, filled = true }: { className?: string; size?: number; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
