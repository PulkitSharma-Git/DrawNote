import { ReactNode } from "react";

export function SignUpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,115,0,0.2),_transparent),_radial-gradient(circle_at_bottom_right,_rgba(0,128,255,0.2),_transparent)]"></div>
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-20"></div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
