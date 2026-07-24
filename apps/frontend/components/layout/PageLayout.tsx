import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen text-white bg-[#0b0d12] overflow-hidden">
      {/* Ambient Glows — subtler, smaller */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-[320px] h-[320px] bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-[280px] h-[280px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[240px] h-[240px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
