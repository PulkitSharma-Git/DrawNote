import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0d12] text-white">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-24 -top-24 h-[320px] w-[320px] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[240px] w-[240px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}