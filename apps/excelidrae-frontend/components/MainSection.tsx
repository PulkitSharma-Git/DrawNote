"use client"
import Link from "next/link";
import { Button } from "@/components/Button";
import { motion } from "framer-motion";

export default function MainSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-8 pt-28">
      {/* Tagline */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 drop-shadow-lg"
      >
        Brainstorm. Collaborate. Create.
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="text-lg sm:text-xl text-gray-300 mt-4 max-w-2xl"
      >
        A real-time collaborative whiteboard to visualize your ideas with others seamlessly.
      </motion.p>

      {/* Call-to-Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
        className="mt-8 flex gap-6"
      >
        <Link href="/signup">
          <Button>Get Started</Button>
        </Link>
      </motion.div>
    </div>
  );
}

