"use client";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import { Button } from "@/components/ui/Button";
import BackgroundAnimation from "./BackgroundAnimation";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const FloatingOrb = ({ className, ...anim }: HTMLMotionProps<"div">) => (
  <motion.div
    aria-hidden
    className={`absolute rounded-full blur-3xl ${className}`}
    {...anim}
  />
);

const Badge = () => (
  <motion.span
    {...fadeUp(0)}
    className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 backdrop-blur-md"
  >
    Real-time Collaborative Whiteboard
  </motion.span>
);

const Heading = () => (
  <motion.h1
    {...fadeUp(0.15)}
    className="max-w-4xl text-5xl font-extrabold leading-tight sm:text-6xl md:text-7xl"
  >
    <span className="bg-gradient-to-r from-orange-400 via-red-500 to-blue-500 bg-clip-text text-transparent">
      Think Together.
    </span>
    <br />
    Design in Real Time.
  </motion.h1>
);

const Subtext = () => (
  <motion.p {...fadeUp(0.3)} className="mt-5 max-w-xl text-base text-gray-400">
    Sketch, brainstorm, and collaborate instantly on a shared canvas — built for
    teams, creators, and fast-moving ideas.
  </motion.p>
);

const CTA = () => (
  <motion.div {...fadeUp(0.45)} className="mt-10">
    <Link href="/join">
      <Button className="px-8 py-3 text-base">Get Started</Button>
    </Link>
  </motion.div>
);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden text-white">
      <BackgroundAnimation />

      <FloatingOrb
        className="h-[380px] w-[380px] -top-32 -left-24 bg-gradient-to-br from-orange-500/15 via-red-500/10 to-blue-500/10"
        animate={{ y: [0, -24, 0], x: [0, 16, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <FloatingOrb
        className="h-[380px] w-[380px] -bottom-40 -right-24 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-pink-500/10"
        animate={{ y: [0, 32, 0], x: [0, -16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <Badge />
        <Heading />
        <Subtext />
        <CTA />
      </div>
    </section>
  );
}
