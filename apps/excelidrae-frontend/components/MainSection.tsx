"use client"
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import BouncingBalls from "./BouncingBalls";
import FloatingShapes from "./FloatingShapes";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-black/60" />
      <BouncingBalls />

      {/* Gradient Orbs */}
<motion.div
  aria-hidden
  animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
  className="absolute -top-40 -left-32 h-[500px] w-[500px] rounded-full
             bg-gradient-to-br from-orange-500/30 via-red-500/20 to-blue-500/20 blur-3xl"
/>

<motion.div
  aria-hidden
  animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
  className="absolute -bottom-52 -right-40 h-[500px] w-[500px] rounded-full
             bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/20 blur-3xl"
/>
      <FloatingShapes />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center rounded-full border border-white/10
                     bg-white/5 px-4 py-2 text-sm backdrop-blur-md"
        >
          Real-time Collaborative Whiteboard
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-5xl text-5xl font-extrabold leading-tight sm:text-6xl md:text-7xl"
        >
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
            Think Together.
          </span>
          <br />
          Design in Real Time.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 max-w-2xl text-lg text-gray-300"
        >
          Sketch, brainstorm, and collaborate instantly on a shared canvas —
          built for teams, creators, and fast-moving ideas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Link href="/join">
            <Button className="px-10 py-4 text-lg">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
