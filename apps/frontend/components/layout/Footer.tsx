
import Link from "next/link";

/* ────────────────────────────
   Types
   ──────────────────────────── */

interface NavLink {
  label: string;
  href: string;
}

interface DecoProps {
  className?: string;
}

/* ────────────────────────────
   Constants
   ──────────────────────────── */

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#" },
  { label: "About", href: "#" },
  { label: "GitHub", href: "#" },
];

/* ────────────────────────────
   Decorative Components
   ──────────────────────────── */

const StickyNote = ({ className = "" }: DecoProps) => (
  <div
    className={`
      absolute rounded-xl border border-orange-400/20 
      bg-orange-400/5 backdrop-blur-sm transition-all duration-500 
      hover:border-orange-400/40 hover:bg-orange-400/10 hover:scale-105
      ${className}
    `}
  >
    <div className="mx-auto mt-5 h-[2px] w-12 rounded bg-orange-300/20" />
    <div className="mx-auto mt-3 h-[2px] w-16 rounded bg-orange-300/15" />
    <div className="mx-auto mt-3 h-[2px] w-10 rounded bg-orange-300/15" />
  </div>
);

const WhiteboardCard = ({ className = "" }: DecoProps) => (
  <div
    className={`
      absolute rounded-2xl border border-white/10 
      bg-white/[0.02] backdrop-blur-sm transition-all duration-500
      hover:border-white/20 hover:bg-white/[0.05] hover:scale-105
      ${className}
    `}
  >
    <div className="p-4">
      <div className="mb-3 h-2 w-20 rounded-full bg-white/10" />
      <div className="mb-2 h-2 w-16 rounded-full bg-white/5" />
      <div className="h-2 w-12 rounded-full bg-white/5" />
    </div>
  </div>
);

const SketchRectangle = ({ className = "" }: DecoProps) => (
  <svg
    className={`absolute transition-all duration-500 hover:opacity-100 opacity-60 ${className}`}
    width="250"
    height="150"
    viewBox="0 0 250 150"
    fill="none"
  >
    <path
      d="M16 18L232 20L235 128L20 131L16 18Z"
      stroke="rgba(255,255,255,.12)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 22L228 18"
      stroke="rgba(255,255,255,.06)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SketchCircle = ({ className = "" }: DecoProps) => (
  <svg
    className={`absolute transition-all duration-500 hover:opacity-100 opacity-60 ${className}`}
    width="150"
    height="150"
    viewBox="0 0 150 150"
    fill="none"
  >
    <path
      d="M76 18C110 15 133 46 129 78C126 113 98 134 70 130C38 126 18 97 21 66C24 36 48 19 76 18Z"
      stroke="rgba(255,255,255,.12)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const Pencil = ({ className = "" }: DecoProps) => (
  <svg
    className={`absolute transition-all duration-500 hover:scale-110 hover:opacity-100 opacity-70 ${className}`}
    width="230"
    height="48"
    viewBox="0 0 230 48"
    fill="none"
  >
    <rect x="12" y="14" width="18" height="20" rx="3" fill="rgba(239,68,68,.18)" />
    <rect x="30" y="14" width="8" height="20" fill="rgba(255,255,255,.12)" />
    <rect x="38" y="16" width="150" height="16" rx="8" fill="rgba(249,115,22,.18)" />
    <polygon points="188,16 214,24 188,32" fill="rgba(255,255,255,.16)" />
    <polygon points="214,24 228,24 216,20" fill="rgba(255,255,255,.28)" />
  </svg>
);

const Scribble = ({ className = "", color = "#F97316" }: DecoProps & { color?: string }) => (
  <svg
    className={`absolute transition-all duration-500 hover:opacity-100 opacity-70 ${className}`}
    width="420"
    height="120"
    viewBox="0 0 420 120"
    fill="none"
  >
    <path
      d="M5 75C55 15 95 95 150 45C200 -5 255 105 305 35C355 -10 390 90 415 18"
      stroke={color}
      strokeOpacity=".22"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

const SketchArrow = ({ className = "" }: DecoProps) => (
  <svg
    className={`absolute transition-all duration-500 hover:opacity-100 opacity-60 ${className}`}
    width="320"
    height="180"
    viewBox="0 0 320 180"
    fill="none"
  >
    <path
      d="M18 150C65 90 130 120 180 70C225 25 260 50 295 85"
      stroke="rgba(59,130,246,.22)"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M278 70L296 85L276 102"
      stroke="rgba(59,130,246,.22)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SelectionBox = ({ className = "" }: DecoProps) => (
  <svg
    className={`absolute transition-all duration-500 hover:opacity-100 opacity-60 ${className}`}
    width="220"
    height="140"
    viewBox="0 0 220 140"
    fill="none"
  >
    <rect
      x="15"
      y="15"
      width="185"
      height="105"
      rx="12"
      stroke="rgba(59,130,246,.18)"
      strokeWidth="3"
      strokeDasharray="10 8"
    />
  </svg>
);

const Marker = ({ className = "" }: DecoProps) => (
  <svg
    className={`absolute transition-all duration-500 hover:scale-110 hover:opacity-100 opacity-70 ${className}`}
    width="190"
    height="42"
    viewBox="0 0 190 42"
    fill="none"
  >
    <rect x="22" y="13" width="122" height="16" rx="8" fill="rgba(59,130,246,.18)" />
    <rect x="144" y="13" width="24" height="16" rx="3" fill="rgba(255,255,255,.12)" />
    <polygon points="0,21 22,14 22,28" fill="rgba(255,255,255,.18)" />
  </svg>
);

const Ruler = ({ className = "" }: DecoProps) => (
  <svg
    className={`absolute transition-all duration-500 hover:opacity-100 opacity-60 ${className}`}
    width="260"
    height="30"
    viewBox="0 0 260 30"
  >
    <rect width="260" height="16" y="7" rx="8" fill="rgba(255,255,255,.05)" />
    {Array.from({ length: 18 }).map((_, i) => (
      <line
        key={i}
        x1={18 + i * 13}
        x2={18 + i * 13}
        y1="7"
        y2={i % 2 === 0 ? "22" : "18"}
        stroke="rgba(255,255,255,.18)"
      />
    ))}
  </svg>
);

const Palette = ({ className = "" }: DecoProps) => (
  <div className={`absolute flex gap-3 transition-all duration-500 hover:scale-110 ${className}`}>
    {["orange", "red", "blue", "green", "violet"].map((color) => (
      <div
        key={color}
        className={`
          h-4 w-4 rounded-full transition-all duration-300 
          hover:scale-125 hover:brightness-125
          bg-${color}-400/30
        `}
      />
    ))}
  </div>
);


/* ────────────────────────────
   Noise Texture
   ──────────────────────────── */

const NoiseOverlay = () => (
  <div
    className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E")`,
    }}
  />
);

/* ────────────────────────────
   Decorative Layer
   ──────────────────────────── */

const WhiteboardCanvas = () => (
  <div className="pointer-events-auto absolute inset-0 overflow-hidden opacity-70">
    {/* Desktop: Full decorative set */}
    <div className="hidden md:block">
      <StickyNote className="left-[5%] bottom-52 h-28 w-28 -rotate-6" />
      <StickyNote className="right-[8%] bottom-60 h-24 w-24 rotate-12" />
      <WhiteboardCard className="left-[52%] bottom-24 h-32 w-52 rotate-2" />
      <SketchRectangle className="left-[20%] bottom-14 -rotate-6" />
      <SketchCircle className="right-[26%] bottom-1" />
      <SelectionBox className="left-[58%] bottom-52 rotate-3" />
      <SketchArrow className="left-[35%] bottom-56" />
      <Scribble className="left-[10%] bottom-12" />
      <Scribble className="right-[5%] bottom-28 scale-75" color="#3B82F6" />
      <Pencil className="right-[4%] bottom-16 rotate-[28deg]" />
      <Ruler className="left-[8%] bottom-14 -rotate-12" />
      <Marker className="right-[24%] bottom-28 rotate-[14deg]" />
      <Palette className="left-[54%] bottom-14" />
    </div>

    {/* Mobile: Curated minimal set */}
    <div className="block md:hidden">
      <StickyNote className="left-[8%] bottom-32 h-20 w-20 -rotate-6" />
      <WhiteboardCard className="right-[5%] bottom-20 h-24 w-36 rotate-2" />
      <Scribble className="left-[5%] bottom-8 scale-50" />
      <Pencil className="right-[2%] bottom-10 rotate-[28deg] scale-75" />
      <Palette className="left-[45%] bottom-8 scale-75" />
    </div>

    <NoiseOverlay />
  </div>
);

/* ────────────────────────────
   Main Footer
   ──────────────────────────── */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mx-3 overflow-hidden rounded-t-[24px] bg-[#050505] sm:mx-6 lg:mx-8 lg:rounded-t-[30px]">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Bottom glow */}
      <div className="absolute inset-x-0 -bottom-24 h-56 bg-gradient-to-r from-orange-500/20 via-red-500/25 to-blue-500/20 blur-3xl" />

      {/* Background vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_65%)]" />

      {/* Decorative whiteboard elements */}
      <WhiteboardCanvas />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 pt-12 pb-36 sm:gap-12 sm:px-8 sm:pt-16 sm:pb-48 lg:gap-16 lg:pt-20 lg:pb-72">
        {/* Brand + Description */}
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Draw
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
              Note
            </span>
          </h2>

          <p className="max-w-md text-center text-sm leading-7 text-gray-500 sm:max-w-lg sm:text-base">
            A collaborative infinite canvas built for teams, creators and ideas
            that deserve more than static documents.
          </p>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-300 hover:text-white relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white/30 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center text-xs text-gray-600 sm:flex-row sm:text-sm">
          <p>© {currentYear} DrawNote. All rights reserved.</p>
          <p className="text-gray-700">Built for collaborative creativity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;