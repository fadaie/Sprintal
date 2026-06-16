export default function LogoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="logo-icon-svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <radialGradient id="lg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="32" height="32" rx="9" fill="url(#lg-glow)" className="logo-glow-bg" />

      <rect x="1" y="1" width="30" height="30" rx="8" stroke="url(#lg1)" strokeWidth="2.5" fill="none" className="logo-border" />

      <rect x="7.5" y="20" width="5" height="8" rx="1.2" fill="url(#lg1)" className="logo-bar logo-bar-1" />
      <rect x="14" y="13" width="5" height="15" rx="1.2" fill="url(#lg1)" className="logo-bar logo-bar-2" />
      <rect x="20.5" y="6" width="5" height="22" rx="1.2" fill="url(#lg1)" className="logo-bar logo-bar-3" />
    </svg>
  )
}
