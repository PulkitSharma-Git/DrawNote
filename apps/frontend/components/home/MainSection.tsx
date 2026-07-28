"use client";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import { Button } from "@/components/ui/Button";
import BackgroundAnimation from "./BackgroundAnimation";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const FloatingOrb = ({ className, ...anim }: HTMLMotionProps<"div">) => (
  <motion.div
    aria-hidden
    className={`absolute rounded-full blur-3xl ${className}`}
    {...anim}
  />
);

const Badge = () => (
  <motion.span
    {...fadeUp(0)}
    className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md uppercase tracking-wider"
  >
    Real-time Collaborative Whiteboard
  </motion.span>
);

const Heading = () => (
  <motion.h1
    {...fadeUp(0.15)}
    className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl text-center md:text-left"
  >
    <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
      Think Together.
    </span>
    <br />
    Design in Real Time.
  </motion.h1>
);

const Subtext = () => (
  <motion.p {...fadeUp(0.3)} className="mt-5 text-base text-gray-400 text-center md:text-left leading-relaxed max-w-lg">
    Sketch, brainstorm, and collaborate instantly on a shared canvas — built for teams, creators, and fast-moving ideas.
  </motion.p>
);

const CTA = () => (
  <motion.div {...fadeUp(0.45)} className="mt-8">
    <Link href="/join">
      <Button className="px-8 py-3 text-base">Get Started</Button>
    </Link>
  </motion.div>
);

const CollaborativeCanvasArt = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, x: 20 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
    className="relative w-full max-w-[540px]"
  >
    {/* Glow blur background behind the SVG art */}
    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-red-500/10 to-blue-500/20 rounded-3xl blur-3xl pointer-events-none opacity-40" />

    <svg
      viewBox="0 0 600 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-2xl relative z-10"
    >
      <defs>
        <style>
          {`
            @keyframes drawPath {
              0% { stroke-dashoffset: 600; }
              50%, 75% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 600; }
            }
            @keyframes scaleRect {
              0%, 10% { transform: scale(0); opacity: 0; }
              40%, 80% { transform: scale(1); opacity: 0.9; }
              100% { transform: scale(0); opacity: 0; }
            }
            @keyframes drawLinePath {
              0%, 35% { stroke-dashoffset: 160; }
              65%, 85% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 160; }
            }
            @keyframes arrowheadFade {
              0%, 62% { opacity: 0; }
              65%, 85% { opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes sarahAnim {
              0% { transform: translate(150px, 140px); }
              7% { transform: translate(225px, 145px); }
              13% { transform: translate(200px, 250px); }
              20% { transform: translate(120px, 280px); }
              26% { transform: translate(100px, 180px); }
              33% { transform: translate(120px, 155px); }
              40% { transform: translate(150px, 140px); }
              40%, 75% { transform: translate(150px, 140px); }
              100% { transform: translate(150px, 140px); }
            }
            @keyframes alexAnim {
              0%, 10% { transform: translate(450px, 225px); }
              40%, 80% { transform: translate(540px, 290px); }
              100% { transform: translate(450px, 225px); }
            }
            @keyframes stylusAnim {
              0%, 30% { transform: translate(270px, 120px) rotate(-40deg); }
              35% { transform: translate(220px, 220px) rotate(-40deg); }
              50% { transform: translate(286px, 220px) rotate(-45deg); }
              65% { transform: translate(360px, 220px) rotate(-35deg); }
              75%, 100% { transform: translate(270px, 120px) rotate(-40deg); }
            }
            .animate-circle-draw {
              stroke-dasharray: 600;
              stroke-dashoffset: 600;
              animation: drawPath 7s linear infinite;
            }
            .animate-rect-draw {
              transform-origin: 450px 225px;
              animation: scaleRect 7s linear infinite;
            }
            .animate-line-draw {
              stroke-dasharray: 160;
              stroke-dashoffset: 160;
              animation: drawLinePath 7s linear infinite;
            }
            .animate-sarah-cursor {
              animation: sarahAnim 7s linear infinite;
            }
            .animate-alex-cursor {
              animation: alexAnim 7s linear infinite;
            }
            .animate-stylus-pen {
              transform-origin: 0px 0px;
              animation: stylusAnim 7s linear infinite;
            }
          `}
        </style>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.06)" />
        </pattern>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dotted grid overlays directly on the dark page layout background */}
      <rect x="0" y="0" width="600" height="450" fill="url(#grid)" />

      {/* Inner drawing draft elements */}
      {/* 1. Glowing Neon Hand-drawn Circle (Lasso) */}
      <path
        d="M150 140 C 220 100, 250 180, 200 250 C 150 320, 70 260, 100 180 C 110 150, 130 140, 150 140 Z"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#neonGlow)"
        opacity="0.95"
        className="animate-circle-draw"
      />

      {/* 2. Drawing Board Connector Arrow */}
      <path
        d="M220 220 C 260 260, 310 180, 360 220"
        fill="none"
        stroke="url(#glowGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        className="animate-line-draw"
      />

      {/* 3. Glowing Neon Rectangle */}
      <rect
        x="360" y="160"
        width="180" height="130"
        rx="14"
        fill="none"
        stroke="#EF4444"
        strokeWidth="3"
        filter="url(#neonGlow)"
        className="animate-rect-draw"
      />

      {/* Collaborative multiplayer cursor indicators */}
      {/* Sarah (Blue cursor & name banner drawing circle) */}
      <g className="animate-sarah-cursor">
        <path d="M0 0 L15 5 L9 9 L5 15 Z" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />
        <rect x="12" y="12" width="48" height="18" rx="6" fill="#3B82F6" />
        <text x="18" y="24" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Sarah</text>
      </g>

      {/* Alex (Orange cursor & name banner moving pencil) */}
      <g className="animate-alex-cursor">
        <path d="M0 0 L15 5 L9 9 L5 15 Z" fill="#FB923C" stroke="#FFFFFF" strokeWidth="1" />
        <rect x="12" y="12" width="42" height="18" rx="6" fill="#FB923C" />
        <text x="18" y="24" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Alex</text>
      </g>

      {/* Drawing Stylus / Pen drawing a line (Aligned tip at 0,0 local space) */}
      <g className="animate-stylus-pen">
        {/* Pen body */}
        <rect x="-112" y="-5" width="100" height="10" rx="3" fill="#1E293B" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* Metallic grip */}
        <rect x="-37" y="-5" width="15" height="10" fill="#475569" />
        {/* Glowing tip */}
        <polygon points="-12,-5 0,0 -12,5" fill="#FB923C" />
        <circle cx="0" cy="0" r="3.5" fill="#FB923C" filter="url(#neonGlow)" />
      </g>

      {/* Twinkling yellow stars */}
      <g fill="#FBBF24" opacity="0.75">
        <path d="M50 60 L51.5 63 L54 64 L51.5 65 L50 68 L48.5 65 L46 64 L48.5 63 Z" />
        <path d="M240 100 L241.5 103 L244 104 L241.5 105 L240 108 L238.5 105 L236 104 L238.5 103 Z" />
        <path d="M520 110 L521.5 113 L524 114 L521.5 115 L520 118 L518.5 115 L516 114 L518.5 113 Z" />
        <path d="M500 360 L501.5 363 L504 364 L501.5 365 L500 368 L498.5 365 L496 364 L498.5 363 Z" />
      </g>

      {/* Subtle details in background */}
      <circle cx="390" cy="80" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" strokeDasharray="3 3" />
      <line x1="390" y1="58" x2="390" y2="102" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      <line x1="368" y1="80" x2="412" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
    </svg>
  </motion.div>
);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white">
      <BackgroundAnimation />

      <FloatingOrb
        className="h-[380px] w-[380px] -top-32 -left-24 bg-gradient-to-br from-orange-500/15 via-red-500/10 to-blue-500/10"
        animate={{ y: [0, -24, 0], x: [0, 16, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <FloatingOrb
        className="h-[380px] w-[380px] -bottom-40 -right-24 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-pink-500/10"
        animate={{ y: [0, 32, 0], x: [0, -16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row items-center justify-between px-6 pt-24 pb-16 gap-12">
        {/* Left side text layout */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/2">
          <Badge />
          <Heading />
          <Subtext />
          <CTA />
        </div>
        
        {/* Right side collaborative art */}
        <div className="flex items-center justify-center md:w-1/2 w-full">
          <CollaborativeCanvasArt />
        </div>
      </div>
    </section>
  );
}
