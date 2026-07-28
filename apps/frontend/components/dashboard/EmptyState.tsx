// EmptyState.tsx
export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-sm mx-auto relative pointer-events-none">
      {/* SVG Art */}
      <div className="relative mb-6">
        <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="boardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Easel Legs */}
          <line x1="100" y1="50" x2="65" y2="175" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="50" x2="135" y2="175" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="40" x2="100" y2="175" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Shelf for brush */}
          <line x1="45" y1="140" x2="155" y2="140" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

          {/* Drawing Board (Canvas) */}
          <rect x="45" y="50" width="110" height="85" rx="10" fill="url(#boardGrad)" stroke="#475569" strokeWidth="2.5" />
          
          {/* Canvas Inner Border Glow */}
          <rect x="49" y="54" width="102" height="77" rx="7" fill="none" stroke="url(#primaryGrad)" strokeWidth="1.5" strokeOpacity="0.25" />

          {/* Clip at the top of the canvas */}
          <rect x="88" y="45" width="24" height="10" rx="3" fill="#64748B" />
          <rect x="94" y="42" width="12" height="3" rx="1.5" fill="#475569" />

          {/* Drawing on the Canvas (Star with glowing trail) */}
          <path 
            d="M100 68 L105 80 L118 82 L108 90 L111 103 L100 96 L89 103 L92 90 L82 82 L95 80 Z" 
            fill="none" 
            stroke="url(#primaryGrad)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#glow)"
            className="animate-pulse"
          />

          {/* Paintbrush resting on easel shelf */}
          <g transform="translate(50, 140) rotate(-10)">
            <line x1="0" y1="0" x2="90" y2="0" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <path d="M90 -2.5 L97 -2.5 L99 0 L97 2.5 L90 2.5 Z" fill="url(#primaryGrad)" />
          </g>

          {/* Sparkles */}
          <g fill="#FBBF24" opacity="0.6">
            <path d="M30 40 L31.5 43 L34 44 L31.5 45 L30 48 L28.5 45 L26 44 L28.5 43 Z" />
            <path d="M170 100 L171.5 103 L174 104 L171.5 105 L170 108 L168.5 105 L166 104 L168.5 103 Z" />
          </g>
        </svg>
      </div>

      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">No rooms yet</h3>
    </div>
  );
}
