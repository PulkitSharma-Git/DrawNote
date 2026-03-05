// Bar.tsx
import { ReactNode } from "react";

export function Bar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#0b0d12]/80 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/40">
      {children}
    </div>
  );
}