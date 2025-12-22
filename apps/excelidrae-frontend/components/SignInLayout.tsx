import { ReactNode } from "react";

export function SignInLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Base vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />

      {/* Blue light */}
      <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-[140px]" />

      {/* Orange light */}
      <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[140px]" />

      {/* Red light */}
      <div className="absolute -bottom-56 left-1/3 w-[700px] h-[700px] rounded-full bg-red-500/10 blur-[160px]" />

      {/* Noise */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] pointer-events-none" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
