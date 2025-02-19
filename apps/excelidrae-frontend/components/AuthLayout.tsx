export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,115,0,0.2),_transparent),_radial-gradient(circle_at_bottom_right,_rgba(0,128,255,0.2),_transparent)]"></div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
  