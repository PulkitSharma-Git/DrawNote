import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,115,0,0.2),_transparent),_radial-gradient(circle_at_bottom_right,_rgba(0,128,255,0.2),_transparent)]"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-20"></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
