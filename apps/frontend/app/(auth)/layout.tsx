"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[140px]" />
      <div className="absolute -bottom-56 left-1/3 w-[700px] h-[700px] rounded-full bg-red-500/10 blur-[160px]" />

      {/* Animated card container */}
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          x: 48,      // start slightly right
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          x: -48,     // exit to left
          scale: 0.98,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1], // premium easing
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
