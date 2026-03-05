import { ReactNode } from "react";

export function SignInLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b0d12] flex">
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[360px] h-[360px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      {/* Left — Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-16 py-14 relative z-10">
        <span className="text-xl font-extrabold tracking-wide text-white">
          Draw<span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">Note</span>
        </span>

        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            Good to see<br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
              you again.
            </span>
          </h1>
          <p className="text-white/50 text-base max-w-sm font-medium">
            Pick up right where you left off. Your canvas is waiting.
          </p>
        </div>

        <p className="text-xs text-white/20">© {new Date().getFullYear()} DrawNote. All rights reserved.</p>
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