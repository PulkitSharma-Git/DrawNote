import { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
});

const FEATURES = [
  "Real-time collaboration with your team",
  "Draw, sketch and brainstorm on a shared canvas",
  "Built for teams who think visually and move fast",
];

export function SignUpLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${jakarta.className} relative w-screen h-screen overflow-hidden bg-[#0b0d12] flex`}
    >
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Left — Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-16 py-14 relative z-10">
        {/* Logo */}
        <span className="text-xl font-extrabold tracking-wide text-white">
          Draw
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
            Note
          </span>
        </span>

        {/* Headline */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            Where ideas
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
              come to life.
            </span>
          </h1>
          <p className="text-white/50 text-base max-w-sm font-medium">
            A collaborative canvas built for teams who think visually and move
            fast.
          </p>

          {/* Feature list */}
          <ul className="space-y-3 pt-2">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-sm text-white/60"
              >
                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/20">
          © {new Date().getFullYear()} DrawNote. All rights reserved.
        </p>
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent self-stretch" />

      {/* Right — Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
