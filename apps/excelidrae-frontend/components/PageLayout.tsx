import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-[#0b0d12]">

      {/* Soft Color Glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px]
        bg-orange-500/20 rounded-full blur-[120px]" />

      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px]
        bg-blue-500/20 rounded-full blur-[140px]" />

      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px]
        bg-purple-500/20 rounded-full blur-[140px]" />

      {/* Subtle Noise Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.035]" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

